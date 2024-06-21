import 'dotenv/config';
import {
    getDatabaseConfig,
    getIngestLoader,
    getEmbeddingModel,
    getModelClass,
} from '../../../src/yaml_parser/src/LoadYaml.js';
import { RAGApplicationBuilder } from "../../../src/index.js";
import { MongoDBAtlas } from "../../../src/vectorDb/mongo-db-atlas.js";
import { exit } from 'process';


try {
    // Initialize the RAG application
    const llmApplication = await new RAGApplicationBuilder()
        .setModel(getModelClass())
        .setEmbeddingModel(getEmbeddingModel())
        .setVectorDb(getDatabaseConfig())
        .build();

    // Add the sitemap loader
    const dataloader = getIngestLoader();
    for(const data of dataloader){
        await llmApplication.addLoader(data);
    }

    console.log("-- Data ingersted successfully --")
    await llmApplication.createVectorIndex();
    console.log("-- Vector index created successfully --")

} catch (error) {
    console.log("-- Data Error --", error)
}
exit(0);
