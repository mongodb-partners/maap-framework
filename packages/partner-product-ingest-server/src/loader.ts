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
    const ingestLoaders = getIngestLoader();
    for (const loader of ingestLoaders) {
        await llmApplication.addLoader(loader);
    }
    console.log('-- Data ingersted successfully --');
    await llmApplication.createVectorIndex();
    console.log('-- Vector index created successfully --');
} catch (error) {
    console.log('-- Data Error --', error);
}
exit(0);
