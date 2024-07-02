// Import required modules
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as process from 'process';
import { Anthropic, BaseLoader, AzureChatAI, CohereEmbeddings, ConfluenceLoader, DocxLoader, GeckoEmbedding, OpenAi, PdfLoader, SitemapLoader, VertexAI, WebLoader, YoutubeSearchLoader, YoutubeLoader, YoutubeChannelLoader, PptLoader, JsonLoader } from '../../index.js';
import { MongoDBAtlas } from '../../vectorDb/mongo-db-atlas.js';
import { strict as assert } from 'assert';
import { AnyscaleModel } from '../../models/anyscale-model.js';
import { Fireworks } from '../../models/fireworks-model.js';
import { Bedrock } from '../../models/bedrock-model.js';
import { TitanEmbeddings } from '../../embeddings/titan-embeddings.js';
import { NomicEmbeddingsv1 } from '../../embeddings/nomic-v1-embeddings.js';
import { NomicEmbeddingsv1_5 } from '../../embeddings/nomic-v1-5-embeddings.js';
import { AzureOpenAiEmbeddings } from '../../embeddings/azure-embeddings.js';
import { BedrockEmbedding } from '../../embeddings/bedrock-embeddings.js';
import { FireworksEmbedding } from '../../embeddings/fireworks-embeddings.js';

// src/loaders/confluence-loader.ts src/loaders/docx-loader.ts src/loaders/excel-loader.ts src/loaders/json-loader.ts src/loaders/pdf-loader.ts src/loaders/ppt-loader.ts src/loaders/sitemap-loader.ts src/loaders/text-loader.ts src/loaders/web-loader.ts src/loaders/youtube-channel-loader.ts src/loaders/youtube-loader.ts src/loaders/youtube-search-loader.ts
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
    numCandidates: parsedData.vector_store.numDimensions,
    similarityFunction: parsedData.vector_store.similarityFunction,
    minScore: parsedData.vector_store.minScore
  });
}

/**
 Gets the DB info to use in the chatbot application
 */
export function getDatabaseConfigInfo() {
  const parsedData = getDataFromYamlFile();
  const {
    vector_store: { connectionString, dbName, collectionName, vectorSearchIndexName, minScore, numCandidates },
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
    minScore,
    numCandidates
  };
}

/**
 * Returns an instance of the model class based on the parsed data from a YAML file.
 * @returns An instance of the model class.
 */
export function getModelClass() {
  const parsedData = getDataFromYamlFile();

  switch (parsedData.llms.class_name) {
    case 'VertexAI':
      return new VertexAI({ modelName: parsedData.llms.model_name });
    case 'OpenAI':
      return new OpenAi({ modelName: parsedData.llms.model_name });
    case 'Anyscale':
      return new AnyscaleModel({ modelName: parsedData.llms.model_name });
    case 'Fireworks':
      return new Fireworks({ modelName: parsedData.llms.model_name });
    case 'Anthropic':
      return new Anthropic({ modelName: parsedData.llms.model_name });
    case 'Bedrock':
      return new Bedrock({ modelName: parsedData.llms.model_name });
    case 'AzureOpenAI':
      return new AzureChatAI({
        modelName: parsedData.embedding.model_name,
        azureOpenAIApiDeploymentName: parsedData.embedding.deployment_name,
        azureOpenAIApiVersion: parsedData.embedding.api_version,
        azureOpenAIApiInstanceName: parsedData.embedding.azure_openai_api_instance_name
      });
    default:
      // Handle unsupported class name (optional)
      return new Anthropic({ modelName: parsedData.llms.model_name }); // Or throw an error
  }
}

/**
 * Retrieves the embedding model based on the parsed data from a YAML file.
 * @returns The embedding model based on the parsed data.
 */
export function getEmbeddingModel() {
  const parsedData = getDataFromYamlFile();

  switch (parsedData.embedding.class_name) {
    case 'VertexAI':
      return new GeckoEmbedding();
    case 'Azure-OpenAI-Embeddings':
      return new AzureOpenAiEmbeddings({
        modelName: parsedData.embedding.model_name,
        deploymentName: parsedData.embedding.deployment_name,
        apiVersion: parsedData.embedding.api_version,
        azureOpenAIApiInstanceName: parsedData.embedding.azure_openai_api_instance_name
      });
    case 'Cohere':
      return new CohereEmbeddings({ modelName: parsedData.embedding.model_name });
    case 'Titan':
      return new TitanEmbeddings();
    case 'Bedrock':
      return new BedrockEmbedding({ modelName: parsedData.embedding.model_name, dimension: parsedData.embedding.dimension});
    case 'Fireworks':
      return new FireworksEmbedding({ modelName: parsedData.embedding.model_name, dimension: parsedData.embedding.dimension});  
    case 'Nomic-v1':
      return new NomicEmbeddingsv1();
    case 'Nomic-v1.5':
      return new NomicEmbeddingsv1_5();
    default:
      // Handle unsupported class name (optional)
      return new NomicEmbeddingsv1_5(); // Or throw an error
  }
}

/**
 * Returns the appropriate loader based on the parsed data from a YAML file.
 * @returns The loader object or null if no matching loader is found.
 */
export function getIngestLoader() {
  const parsedData = getDataFromYamlFile();
  const dataloaders: BaseLoader[] = [];
  for (const data of parsedData.ingest) {
    switch (data.source) {
      case 'web':
        dataloaders.push(new WebLoader({
          url: data.source_path,
          chunkSize: data.chunk_size,
          chunkOverlap: data.chunk_overlap,
        }));
        break;
      case 'pdf':
        dataloaders.push(new PdfLoader({
          filePath: data.source_path,
          chunkSize: data.chunk_size,
          chunkOverlap: data.chunk_overlap,
        }));
        break;
      case 'sitemap':
        dataloaders.push(new SitemapLoader({
          url: data.source_path,
          chunkSize: data.chunk_size,
          chunkOverlap: data.chunk_overlap,
        }));
        break;
      case 'docx':
        dataloaders.push(new DocxLoader({
          filePath: data.source_path,
          chunkSize: data.chunk_size,
          chunkOverlap: data.chunk_overlap,
        }));
        break;
      case 'confluence':
        dataloaders.push(new ConfluenceLoader({
          spaceNames: data.space_names,
          confluenceBaseUrl: data.confluence_base_url,
          confluenceUsername: data.confluence_username,
          confluenceToken: data.confluence_token,
          chunkSize: data.chunk_size,
          chunkOverlap: data.chunk_overlap,
        }));
        break;
      case 'youtube-search':
        dataloaders.push(new YoutubeSearchLoader({
          searchString: data.query,
          chunkSize: data.chunk_size,
          chunkOverlap: data.chunk_overlap,
        }));
        break;
        case 'youtube':
          dataloaders.push(new YoutubeLoader({
            videoIdOrUrl: data.video_id_or_url,
            chunkSize: data.chunk_size,
            chunkOverlap: data.chunk_overlap,
          }));
        break;
        case 'youtube-channel':
          dataloaders.push(new YoutubeChannelLoader({
            channelId: data.channel_id,
            chunkSize: data.chunk_size,
            chunkOverlap: data.chunk_overlap,
          }));
        break;
        case 'ppt':
          dataloaders.push(new PptLoader({
            filePath: data.source_path,
            chunkSize: data.chunk_size,
            chunkOverlap: data.chunk_overlap,
          }));
        break;
        case 'ppt':
          dataloaders.push(new PptLoader({
            filePath: data.source_path,
            chunkSize: data.chunk_size,
            chunkOverlap: data.chunk_overlap,
          }));
        break;
      default:
      // Handle unsupported source type (optional)
    }
  }
  return dataloaders;
}