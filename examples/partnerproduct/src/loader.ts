import 'dotenv/config';

import { AdaEmbeddings, RAGApplicationBuilder, SitemapLoader } from "../../../src/index.js";
import { MongoDBAtlas } from "../../../src/vectorDb/mongo-db-atlas.js";
import { exit } from 'process';

// Initialize the RAG application
const llmApplication = await new RAGApplicationBuilder()
    .setEmbeddingModel(new AdaEmbeddings())
    .setSearchResultCount(30)
    .setVectorDb(new MongoDBAtlas({ connectionString: "******", dbName: 'EMBEDJS', collectionName: 'embedded_content', textKey: 'text' }))
    .build();

// Add the sitemap loader
await llmApplication.addLoader(new SitemapLoader({ url: 'https://www.careinsurance.com/sitemap.xml' }));

console.log("-- Data ingersted successfully --")
exit(0);
