import 'dotenv/config';
import { getDatabaseConfig, getIngestLoader, getEmbeddingModel, RAGApplicationBuilder } from 'maap-integrations';
import { exit } from 'process';

try {
    // Initialize the RAG application
    const llmApplication = await new RAGApplicationBuilder()
        .setEmbeddingModel(getEmbeddingModel())
        .setVectorDb(getDatabaseConfig())
        .build();

    // Add the sitemap loader
    await llmApplication.addLoader(getIngestLoader());
    console.log('-- Data ingersted successfully --');
    await llmApplication.createVectorIndex();
    console.log('-- Vector index created successfully --');
} catch (error) {
    console.log('-- Data Error --', error);
}
exit(0);
