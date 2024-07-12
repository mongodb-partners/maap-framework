
import 'dotenv/config';
import {
    getModelClass,
    getEmbeddingModel,
    getVBDConfigInfo,
    getAggregateOperatorConfigs,
    getConditionOpConfigs
} from '../../../src/yaml_parser/src/LoadYaml.js';
import {
    PreProcessQuery,
    RAGApplicationBuilder,
    Rerank,
    convertBaseEmbeddingsToEmbedder,
    convertBaseModelToChatLlm,
    withQueryPreprocessor,
    withReranker,
} from '../../../src/index.js';

import { MongoClient } from 'mongodb';
import {
    makeDefaultFindContent,
    MakeUserMessageFunc,
    OpenAiChatMessage,
    GenerateUserPromptFunc,
    makeRagGenerateUserPrompt,
    SystemPrompt,
    makeMongoDbConversationsService,
    AppConfig,
    makeApp,
} from 'mongodb-chatbot-server';
import { makeMongoDbEmbeddedContentStore, logger } from 'mongodb-rag-core';
import { MongoDBCrud } from '../../../src/db/mongodb-crud.js';

const model = getModelClass();
const embedding_model = getEmbeddingModel();
const { dbName, connectionString, vectorSearchIndexName, minScore, numCandidates } = getVBDConfigInfo();


// Load crud operator with query and name of the operator
const crudOperatorConfigs = getAggregateOperatorConfigs();
const conditionOpConfigs = getConditionOpConfigs();
for (const conditionConfig of conditionOpConfigs) {
    let llmbuilder = new RAGApplicationBuilder().setModel(model)
            .setQueryTemplate(conditionConfig.prompt)
            .setEmbeddingModel(embedding_model);

    for (const crudConfig of crudOperatorConfigs) {
        const crud = new MongoDBCrud({ connectionString: crudConfig.connectionString, dbName: crudConfig.dbName, collectionName: crudConfig.collectionName });
        llmbuilder.setDb(
            crud,
            crudConfig.aggregatePipelineName,
            crudConfig.query
        );
    }
    const conditionalLLM = await llmbuilder.build();
    // console.log("DB lookup", conditionalLLM.getDb("testing"));
    console.log("query context", await conditionalLLM.getQueryContext("fetch me messages for someone named Ashwin ", "testing"));
}




// conditionalLLM.build()

// conditionalLLM.query()
