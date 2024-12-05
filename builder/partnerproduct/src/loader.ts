import 'dotenv/config';
import {
    getDatabaseConfig,
    getIngestLoader,
    getEmbeddingModel,
    getModelClass,
} from '../../../src/yaml_parser/src/LoadYaml.js';
import { RAGApplicationBuilder } from "../../../src/index.js";
import { exit } from 'process';


try {
    let chunksAdded = 0;

    // Initialize the RAG application
    const llmApplication = await new RAGApplicationBuilder()
        .setModel(getModelClass())
        .setEmbeddingModel(getEmbeddingModel())
        .setVectorDb(getDatabaseConfig())
        .build();

    const dataloader = getIngestLoader();
    for(const data of dataloader) {
        console.log(`\n -- Preparing to add documents to the database... --`)
        await llmApplication.addLoader(data).then((chunks) => {
            chunksAdded += chunks.entriesAdded;
        });
    }

    if (chunksAdded > 0) {
        console.log(`\n Total documents added : ${chunksAdded} `)
        await llmApplication.createVectorIndex();
        await llmApplication.createTextIndex();
    }
    else {
        console.log("\n-- Data not inserted, please retry --")
    }

} catch (e) {
    console.log("\n Data Error : ", e)
}
exit(0);
