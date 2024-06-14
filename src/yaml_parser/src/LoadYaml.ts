// Import required modules
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as process from 'process';
import { AdaEmbeddings, Anthropic, CohereEmbeddings, GeckoEmbedding, OpenAi, OpenAi3LargeEmbeddings, PdfLoader, VertexAI, WebLoader } from '../../index.js';
import { MongoDBAtlas } from '../../vectorDb/mongo-db-atlas.js';
import { strict as assert } from 'assert';
import { AnyscaleModel } from '../../models/anyscale-model.js';
import { Fireworks } from '../../models/fireworks-model.js';
import { AzureOpenAiEmbeddings } from '../../embeddings/openai-3small-embeddings.js';
import { Bedrock } from '../../models/bedrock-model.js';
import { TitanEmbeddings } from '../../embeddings/titan-embeddings.js';
import { FireworksEmbeddings } from '@langchain/community/embeddings/fireworks';
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

export function getIngestLoader() {
    const parsedData = getDataFromYamlFile();
    if (parsedData.ingest.source === 'web') {
        return new WebLoader({ url: parsedData.ingest.source_path });
    } else if (parsedData.ingest.source === 'pdf') {
        return new PdfLoader({ url: parsedData.ingest.source_path });
    } else {
        return null;
    }
}
