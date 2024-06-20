import { MongoClient } from "mongodb";
import { BaseDb } from "../interfaces/base-db.js";

import { ExtractChunkData, InsertChunkData } from "../global/types.js";

export class MongoDBAtlas implements BaseDb {
  private static readonly INDEX_NAME = "vector_index";
  private static readonly EMBEDDING_KEY = "embedding";
  private static readonly TEXT_KEY = "text";
  private readonly connectionString: string;
  private readonly dbName: string;
  private readonly collectionName: string;
  private readonly client: MongoClient;
  private readonly embeddingKey: string;
  private readonly textKey: string;
  private similarityFunction: string;
  private collection: any;

  constructor({
    connectionString,
    dbName,
    collectionName,
    embeddingKey = MongoDBAtlas.EMBEDDING_KEY,
    textKey = MongoDBAtlas.TEXT_KEY,
    similarityFunction,
  }: {
    connectionString: string;
    dbName: string;
    collectionName: string;
    embeddingKey?: string;
    textKey?: string;
    numDimensions: number;
    similarityFunction: string;
  }) {
    this.connectionString = connectionString;
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.client = new MongoClient(this.connectionString);
    this.embeddingKey = embeddingKey;
    this.textKey = textKey;
    this.similarityFunction = similarityFunction;
  }

  async init() {
    this.collection = this.client
      .db(this.dbName)
      .collection(this.collectionName); // Add this line
  }

  async insertChunks(chunks: InsertChunkData[]): Promise<number> {
    const mapped = chunks.map((chunk) => {
      return {
        chunkIndex: chunk.metadata.id,
        [this.textKey]: chunk.pageContent,
        embedding: chunk.vector,
        metadata: chunk.metadata,
        sourceName: chunk.metadata.originalSource,
        url: chunk.metadata.originalSource,
      };
    });

    await this.collection.insertMany(mapped);

    return mapped.length;
  }

  async similaritySearch(
    query: number[],
    k: number,
  ): Promise<ExtractChunkData[]> {
    const query_object = [
      await this.getVectorSearchQuery(query, k),
      {
        $project: {
          _id: 0,
          score: { $meta: "vectorSearchScore" },
          text: 1,
          metadata: 1,
        },
      },
    ];
    // console.log(query_object);
    const results = await this.collection.aggregate(query_object).toArray(); // Modify this line

    // @ts-ignore
    return results.map((result) => {
      const pageContent = (<any>result)[this.textKey]; // Fix the line

      delete (<any>result.metadata).pageContent;

      return <ExtractChunkData>{
        score: result.score,
        pageContent,
        metadata: result.metadata,
      };
    });
  }

  async getVectorSearchQuery(searchVector: number[], k: number): Promise<{}> {
    return {
      $vectorSearch: {
        index: MongoDBAtlas.INDEX_NAME,
        path: this.embeddingKey,
        queryVector: searchVector,
        numCandidates: 100,
        limit: k,
      },
    };
  }

  async getVectorCount(): Promise<number> {
    return this.collection.countDocuments();
  }

  async deleteKeys(uniqueLoaderId: string): Promise<boolean> {
    await this.collection.deleteOne({
      $match: {
        id: uniqueLoaderId,
      },
    });
    return true;
  }

  async reset(): Promise<void> {
    this.collection.deleteMany({});
  }

  async createVectorIndex(
    numDimensions: number,
    similarityFunction?: string,
  ): Promise<void> {
    try {
      this.similarityFunction = similarityFunction ?? "cosine";
      // define your Atlas Vector Search index
      const index = {
        name: "vector_index",
        type: "vectorSearch",
        definition: {
          fields: [
            {
              type: "vector",
              numDimensions: numDimensions,
              path: this.embeddingKey,
              similarity: this.similarityFunction,
            },
          ],
        },
      };
      // run the helper method
      const result = await this.collection.createSearchIndex(index);
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }
}
