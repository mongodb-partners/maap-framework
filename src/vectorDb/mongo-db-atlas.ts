import { MongoClient } from "mongodb";
import { BaseDb } from '../interfaces/base-db.js';

import { ExtractChunkData, InsertChunkData } from '../global/types.js';

/**
 * MongoDBAtlas class implements the BaseDb interface and provides methods for interacting with a MongoDB Atlas database.
 */
export class MongoDBAtlas implements BaseDb {
    private static readonly INDEX_NAME = "vector_index";
    private static readonly EMBEDDING_KEY = "embedding";
    private static readonly TEXT_KEY = "text";
    private static readonly TEXT_INDEX_NAME = "text_index";
    private readonly connectionString: string;
    private readonly dbName: string;
    private readonly collectionName: string;
    private readonly client: MongoClient;
    private readonly embeddingKey: string;
    private readonly textKey: string;
    private readonly indexName: string;
    private readonly textIndexName?: string;
    private similarityFunction: string;
    private collection: any;
    private numCandidates: number;
    private minScore: number;

    /**
     * Constructs a new MongoDBAtlas instance.
     * @param connectionString The connection string for the MongoDB Atlas database.
     * @param dbName The name of the database.
     * @param collectionName The name of the collection.
     * @param embeddingKey The key for the embedding field in the collection documents. Default is "embedding".
     * @param textKey The key for the text field in the collection documents. Default is "text".
     * @param numCandidates The number of candidates to consider during similarity search. Default is 100.
     * @param similarityFunction The similarity function to use during similarity search.
     */
    constructor({ connectionString, dbName, collectionName, embeddingKey = MongoDBAtlas.EMBEDDING_KEY, textKey = MongoDBAtlas.TEXT_KEY, indexName = MongoDBAtlas.INDEX_NAME, numCandidates = 100, similarityFunction, minScore = 0.1, textIndexName = MongoDBAtlas.TEXT_INDEX_NAME }: { connectionString: string; dbName: string; collectionName: string; embeddingKey?: string; textKey?: string; indexName?: string; numCandidates: number; similarityFunction: string; minScore: number; textIndexName?: string;}
    ) {
        this.connectionString = connectionString;
        this.dbName = dbName;
        this.collectionName = collectionName;
        this.client = new MongoClient(this.connectionString);
        this.embeddingKey = embeddingKey;
        this.textKey = textKey;
        this.indexName = indexName;
        this.textIndexName = textIndexName;
        this.similarityFunction = similarityFunction;
        this.numCandidates = numCandidates;
        this.minScore = minScore;
    }

    /**
     * Initializes the MongoDBAtlas instance by connecting to the database and setting the collection.
     */
    async init() {
        this.collection = this.client.db(this.dbName).collection(this.collectionName);
    }

    /**
     * Inserts chunks of data into the collection.
     * @param chunks An array of InsertChunkData objects representing the data to be inserted.
     * @returns A Promise that resolves to the number of chunks inserted.
     */
    async insertChunks(chunks: InsertChunkData[]): Promise<number> {
        const mapped = chunks.map((chunk) => {
            return {
                chunkIndex: chunk.metadata.id,
                [this.textKey]: chunk.pageContent,
                embedding: chunk.vector,
                metadata: chunk.metadata,
                sourceName: chunk.metadata.originalSource,
                url: chunk.metadata.source,
            };
        });

        await this.collection.insertMany(mapped);

        return mapped.length;
    }

    /**
     * Performs a similarity search using the given query vector.
     * @param query The query vector.
     * @param k The number of results to return.
     * @returns A Promise that resolves to an array of ExtractChunkData objects representing the search results.
     */
    async similaritySearch(query: number[], k: number): Promise<ExtractChunkData[]> {
        const query_object = [await this.getVectorSearchQuery(query, k), { "$project": { "_id": 0, "score": { "$meta": "vectorSearchScore" }, "text": 1, "metadata": 1 } }, {"$match": {"score": {"$gt": this.minScore}}}];
        const results = await this.collection.aggregate(query_object).toArray();

        const result = await results.map((result) => {
            const pageContent = (<any>result)[this.textKey];
            delete (<any>result.metadata).pageContent;

            return <ExtractChunkData>{
                score: result.score,
                pageContent,
                metadata: result.metadata,
            }
        });

        return result
    }

    /**
     * Performs a hybrid search using reciprocal-rank-fusion for the given textQuery and vectorQuery.
     * @see https://www.mongodb.com/docs/atlas/atlas-vector-search/tutorials/reciprocal-rank-fusion/
     *
     * @param textQuery The query text for hybrid search.
     * @param query The query vector.
     * @param k The number of results to return.
     * @returns A Promise that resolves to an array of ExtractChunkData objects representing the search results.
     */
    async hybridSearch(textQuery: string, query: number[], k: number, vectorWeight = 0.1, fullTextWeight = 0.9): Promise<ExtractChunkData[]> {
        const query_object = [
            await this.getVectorSearchQuery(query, k),
            {
                "$group": {
                  "_id": null,
                  "docs": {"$push": "$$ROOT"}
                }
            },
            {
                "$unwind": {
                  "path": "$docs",
                  "includeArrayIndex": "rank"
                }
            },
            {
                "$addFields": {
                  "_id": "$docs._id",
                  "vs_score": {
                    "$multiply": [
                      vectorWeight, {
                        "$divide": [
                          1.0, {
                            "$add": ["$rank", 60]
                          }
                        ]
                      }
                    ]
                  }
                }
            },
            {
                "$unionWith": {
                  "coll": this.collectionName,
                  "pipeline": [
                    {
                      "$search": {
                        "index": this.textIndexName,
                        "text": {
                          "query": textQuery,
                          "path": this.textKey
                        }
                      }
                    }, {
                      "$limit": k
                    }, {
                      "$group": {
                        "_id": null,
                        "docs": {"$push": "$$ROOT"}
                      }
                    }, {
                      "$unwind": {
                        "path": "$docs",
                        "includeArrayIndex": "rank"
                      }
                    }, {
                      "$addFields": {
                        "_id": "$docs._id",
                        "fts_score": {
                          "$multiply": [
                            fullTextWeight, {
                              "$divide": [
                                1.0, {
                                  "$add": ["$rank", 60]
                                }
                              ]
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
            },
            {
                "$group": {
                  "_id": "$_id",
                  docs: {
                    $first: "$docs",
                  },
                  "vs_score": {"$max": "$vs_score"},
                  "fts_score": {"$max": "$fts_score"}
                }
            },
            {
                "$addFields": {
                  "docs.vs_score": {"$ifNull": ["$vs_score", 0]},
                  "docs.fts_score": {"$ifNull": ["$fts_score", 0]}
                }
            },
            {
                "$addFields": {
                  "docs.score": {"$add": ["$docs.vs_score", "$docs.fts_score"]}
                }
            },
            {
              $replaceRoot: {newRoot: "$docs"}
            },
            {
                "$sort": {"score": -1}
            },
            {
                "$limit": k
            }
        ];
        const results = await this.collection.aggregate(query_object).toArray();

        return results.map((result) => {
            const pageContent = (<any>result)[this.textKey];
            delete (<any>result.metadata).pageContent;

            return <ExtractChunkData>{
                score: result.score,
                vs_score: result.vs_score,
                fts_score: result.fts_score,
                pageContent,
                metadata: result.metadata,
            }
        });
    }

    /**
     * Generates the vector search query object.
     * @param searchVector The search vector.
     * @param k The number of candidates to consider.
     * @returns A Promise that resolves to the vector search query object.
     */
    async getVectorSearchQuery(searchVector: number[], k: number): Promise<{}> {
        return {
            "$vectorSearch": {
                "index": this.indexName,
                "path": this.embeddingKey,
                "queryVector": searchVector,
                "numCandidates": this.numCandidates,
                "limit": k
            }
        };
    }

    /**
     * Gets the count of vectors in the collection.
     * @returns A Promise that resolves to the number of vectors in the collection.
     */
    async getVectorCount(): Promise<number> {
        return this.collection.countDocuments();
    }

    /**
     * Deletes keys from the collection based on the unique loader ID.
     * @param uniqueLoaderId The unique loader ID.
     * @returns A Promise that resolves to a boolean indicating whether the keys were successfully deleted.
     */
    async deleteKeys(uniqueLoaderId: string): Promise<boolean> {
        await this.collection.deleteOne({
            "$match": {
                "id": uniqueLoaderId,
            }
        });
        return true;
    }

    /**
     * Resets the collection by deleting all documents.
     * @returns A Promise that resolves when the collection has been reset.
     */
    async reset(): Promise<void> {
        this.collection.deleteMany({});
    }

    /**
     * Creates a vector index in the collection.
     * @param numDimensions The number of dimensions for the vector index.
     * @param similarityFunction The similarity function to use for the vector index. Default is "cosine".
     * @returns A Promise that resolves when the vector index has been created.
     */
    async createVectorIndex(numDimensions: number, similarityFunction?: string): Promise<void> {
        try {

            this.similarityFunction = similarityFunction ?? "cosine";
            const index = {
                name: this.indexName,
                type: "vectorSearch",
                definition: {
                    "fields": [
                        {
                            "type": "vector",
                            "numDimensions": numDimensions,
                            "path": this.embeddingKey,
                            "similarity": this.similarityFunction
                        }
                    ]
                }
            }
            await this.collection.createSearchIndex(index);
            console.log("\n-- Vector index created --")
        } catch (e) {
            return Promise.reject(e.codeName);
        }
    }

    /**
     * Creates a text search index in the collection.
     * @returns A Promise that resolves when the text search index has been created.
     */
    async createTextIndex(): Promise<void> {
        try {
            const index = {
                name: this.textIndexName,
                type: "search",
                definition: {
                    "mappings": {
                        "dynamic": false,
                        "fields": {
                            "text": [{
                                "type": "string"
                            }]
                        }
                    }
                }
            }
            await this.collection.createSearchIndex(index);
            console.log("\n-- Text search index created --")
        } catch (e) {
            return Promise.reject(e.codeName);
        }
    }

    async docsCount(): Promise<number> {
        try {
            const docsCount = await this.client.db(this.dbName).collection(this.collectionName).estimatedDocumentCount();
            return docsCount;
        }
        catch (e) {
            return 0;
        }
    }
}
