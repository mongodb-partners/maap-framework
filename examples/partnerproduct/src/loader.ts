import 'dotenv/config';
import {
    getDatabaseConfig,
    getIngestLoader,
    getEmbeddingModel,
} from '../../../src/yaml_parser/src/LoadYaml.js';
import { RAGApplicationBuilder } from "../../../src/index.js";
import { MongoDBAtlas } from "../../../src/vectorDb/mongo-db-atlas.js";
import { exit } from 'process';



// Initialize the RAG application
const llmApplication = await new RAGApplicationBuilder()
    .setEmbeddingModel(getEmbeddingModel())
    .setVectorDb(getDatabaseConfig())
    .build();

// Add the sitemap loader
await llmApplication.addLoader(getIngestLoader());

console.log("-- Data ingersted successfully --")
exit(0);
