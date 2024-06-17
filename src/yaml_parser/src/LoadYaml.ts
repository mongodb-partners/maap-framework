// Import required modules
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as process from 'process';
import { Anthropic, CohereEmbeddings, ConfluenceLoader, DocxLoader, GeckoEmbedding, OpenAi, PdfLoader, SitemapLoader, VertexAI, WebLoader } from '../../index.js';
import { MongoDBAtlas } from '../../vectorDb/mongo-db-atlas.js';
import { strict as assert } from 'assert';
import { AnyscaleModel } from '../../models/anyscale-model.js';
import { Fireworks } from '../../models/fireworks-model.js';
import { AzureOpenAiEmbeddings } from '../../embeddings/openai-3small-embeddings.js';
import { Bedrock } from '../../models/bedrock-model.js';
import { TitanEmbeddings } from '../../embeddings/titan-embeddings.js';
import { NomicEmbeddingsv1 } from '../../embeddings/nomic-v1-embeddings.js';
import { NomicEmbeddingsv1_5 } from '../../embeddings/nomic-v1-5-embeddings.js';
function getDataFromYamlFile() {
    const args = process.argv.slice(2);

    // Check if a file path is provided
    if (!args[0]) {
        throw new Error('Please provide the YAML file path as an argument.');
    }
    const data = fs.readFileSync(args[0], 'utf8');
    const parsedData = yaml.load(data);
    return parsedData;
}

export function getDatabaseConfig() {
    const parsedData = getDataFromYamlFile();
    return new MongoDBAtlas({
        connectionString: parsedData.vector_store.connectionString,
        dbName: parsedData.vector_store.dbName,
        collectionName: parsedData.vector_store.collectionName,
        embeddingKey: parsedData.vector_store.embeddingKey,
        textKey: parsedData.vector_store.textKey,
        numDimensions: parsedData.vector_store.numDimensions, 
        similarityFunction: parsedData.vector_store.similarityFunction
    });
}

/**
 Gets the DB info to use in the chatbot application
 */
export function getDatabaseConfigInfo() {
    const parsedData = getDataFromYamlFile();
    const {
        vector_store: { connectionString, dbName, collectionName, vectorSearchIndexName },
    } = parsedData;
    
    assert(typeof connectionString === 'string', 'connectionString is required');
    assert(typeof dbName === 'string', 'dbName is required');
    assert(typeof collectionName === 'string', 'collectionName is required');
    assert(typeof vectorSearchIndexName === 'string', 'vectorSearchIndexName is required');

    return {
        connectionString,
        dbName,
        collectionName,
        vectorSearchIndexName,
    };
}

/**
 * Returns an instance of the model class based on the parsed data from a YAML file.
 * @returns An instance of the model class.
 */
export function getModelClass() {
    const parsedData = getDataFromYamlFile();
    if (parsedData.llms.class_name === 'VertexAI') {
        return new VertexAI({ modelName: parsedData.llms.model_name });
    } else if (parsedData.llms.class_name === 'OpenAI') {
        return new OpenAi({ modelName: parsedData.llms.model_name });
    } else if (parsedData.llms.class_name === 'Anyscale') {
        return new AnyscaleModel({modelName: parsedData.llms.model_name});
    } else if (parsedData.llms.class_name === 'Fireworks') {
        return new Fireworks({modelName: parsedData.llms.model_name});
    } else if (parsedData.llms.class_name === 'Anthropic') {
        return new Anthropic({modelName: parsedData.llms.model_name});
    } else if (parsedData.llms.class_name === 'Bedrock') {
        return new Bedrock({modelName: parsedData.llms.model_name});
    } else {
        return new Anthropic({modelName: parsedData.llms.model_name});
    }
}

/**
 * Retrieves the embedding model based on the parsed data from a YAML file.
 * @returns The embedding model based on the parsed data.
 */
export function getEmbeddingModel() {
    const parsedData = getDataFromYamlFile();
    if (parsedData.embedding.class_name === 'VertexAI') {
        return new GeckoEmbedding();
    } else if (parsedData.embedding.class_name === 'Azure-OpenAI-Embeddings') {
        return new AzureOpenAiEmbeddings({modelName: parsedData.embedding.model_name});
    } else if (parsedData.embedding.class_name === 'Cohere') {
        return new CohereEmbeddings({modelName: parsedData.embedding.model_name});
    } else if (parsedData.embedding.class_name === 'Titan') {
        return new TitanEmbeddings();
    } else if (parsedData.embedding.class_name === 'Nomic-v1') {
        return new NomicEmbeddingsv1();
    } else if (parsedData.embedding.class_name === 'Nomic-v1.5') {
        return new NomicEmbeddingsv1_5();
    } else {
        return new NomicEmbeddingsv1_5();
    }
}

/**
 * Returns the appropriate loader based on the parsed data from a YAML file.
 * @returns The loader object or null if no matching loader is found.
 */
export function getIngestLoader() {
    const parsedData = getDataFromYamlFile();
    if (parsedData.ingest.source === 'web') {
        return new WebLoader({ url: parsedData.ingest.source_path ,
            chunkSize: parsedData.ingest.chunk_size, 
            chunkOverlap: parsedData.ingest.chunk_overlap});
    } else if (parsedData.ingest.source === 'pdf') {
        return new PdfLoader({ filePath: parsedData.ingest.source_path ,
            chunkSize: parsedData.ingest.chunk_size, 
            chunkOverlap: parsedData.ingest.chunk_overlap});
    } else if (parsedData.ingest.source === 'sitemap') {
        return new SitemapLoader({ url: parsedData.ingest.source_path ,
            chunkSize: parsedData.ingest.chunk_size, 
            chunkOverlap: parsedData.ingest.chunk_overlap});
    } else if (parsedData.ingest.source === 'docx') {
        return new DocxLoader({ filePath: parsedData.ingest.source_path ,
            chunkSize: parsedData.ingest.chunk_size, 
            chunkOverlap: parsedData.ingest.chunk_overlap});
    } else if (parsedData.ingest.source === 'confluence') {
        return new ConfluenceLoader({ spaceNames: parsedData.ingest.space_names,
            confluenceBaseUrl: parsedData.ingest.confluence_base_url,
            confluenceUsername: parsedData.ingest.confluence_username,
            confluenceToken: parsedData.ingest.confluence_token,
            chunkSize: parsedData.ingest.chunk_size,
            chunkOverlap: parsedData.ingest.chunk_overlap});
    } else {
        return null;
    }
}
