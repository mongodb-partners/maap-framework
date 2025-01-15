import { BaseDb } from '../interfaces/base-db.js';
import { BaseLoader } from '../interfaces/base-loader.js';
import { RAGApplication } from './rag-application.js';
import { BaseCache } from '../interfaces/base-cache.js';
import { BaseEmbeddings } from '../interfaces/base-embeddings.js';
import { BaseModel } from '../interfaces/base-model.js';
import { SIMPLE_MODELS, SIMPLE_RANKERS } from '../global/constants.js';
import { OpenAi } from '../models/langChain/openai-model.js';
import { BaseReranker } from '../interfaces/base-reranker.js';
import { CohereReranker } from '../reranker/cohere-reranker.js';
import { getModelClass } from '../yaml_parser/src/LoadYaml.js';
import { MongoDBCrud } from '../db/mongodb-crud.js';

export class RAGApplicationBuilder {
    private searchResultCount: number;
    private loaders: BaseLoader[];
    private vectorDb: BaseDb;
    private temperature: number;
    private queryTemplate: string;
    private cache?: BaseCache;
    private embeddingModel: BaseEmbeddings;
    private model: BaseModel;
    private embeddingRelevanceCutOff: number;
    private reranker: BaseReranker;
    private dbLookup: Map<string, any> = new Map<string, any>();

    constructor() {
        this.loaders = [];
        this.temperature = 0.1;
        this.searchResultCount = 7;

        this.queryTemplate = `You are a helpful human like chat bot. Use relevant provided context and chat history to answer the query at the end. Answer in full.
        If you don't know the answer, just say that you don't know, don't try to make up an answer. 
        
        Do not use words like context or training data when responding. You can say you do not have all the information but do not indicate that you are not a reliable source.`;

        this.setModel(getModelClass());
        this.embeddingRelevanceCutOff = 0;
    }

    async build() {
        const entity = new RAGApplication(this);
        await entity.init();
        return entity;
    }

    addLoader(loader: BaseLoader) {
        this.loaders.push(loader);
        return this;
    }

    setSearchResultCount(searchResultCount: number) {
        this.searchResultCount = searchResultCount;
        return this;
    }

    setVectorDb(vectorDb: BaseDb) {
        this.vectorDb = vectorDb;
        return this;
    }

    setDb(db: MongoDBCrud, key: string, query: any[]) {
        this.dbLookup.set(key,{"database": db, "aggregateQuery": query});
    }

    setTemperature(temperature: number) {
        this.temperature = temperature;
        if (this.model) this.setModel(this.model);
        return this;
    }

    setEmbeddingRelevanceCutOff(embeddingRelevanceCutOff: number) {
        this.embeddingRelevanceCutOff = embeddingRelevanceCutOff;
        return this;
    }

    setQueryTemplate(queryTemplate: string) {
        // if (!queryTemplate.includes('{0}'))
        //     throw new Error('queryTemplate must include a placeholder for the query using {0}');

        this.queryTemplate = queryTemplate;
        return this;
    }

    setCache(cache: BaseCache) {
        this.cache = cache;
        return this;
    }

    setEmbeddingModel(embeddingModel: BaseEmbeddings) {
        this.embeddingModel = embeddingModel;
        return this;
    }

    setModel(model: string | SIMPLE_MODELS | BaseModel) {
        if (typeof model === 'object') this.model = model;
        else {
            if (model === SIMPLE_MODELS.OPENAI_GPT4_O) this.model = new OpenAi({ modelName: 'gpt-4o' });
            else if (model === SIMPLE_MODELS['OPENAI_GPT4_TURBO'])
                this.model = new OpenAi({ modelName: 'gpt-4-turbo' });
            else if (model === SIMPLE_MODELS['OPENAI_GPT3.5_TURBO'])
                this.model = new OpenAi({ modelName: 'gpt-3.5-turbo' });
            else this.model = new OpenAi({ modelName: model });
        }

        return this;
    }

    setReranker(reranker: string | BaseReranker) {
        if (typeof reranker === 'object') this.reranker = reranker;
        else {
            if (reranker === String(SIMPLE_RANKERS.COHERE_RERANK))
                this.reranker = new CohereReranker({ modelName: 'rerank-english-v2.0' , k: 3});
            else this.reranker = null;
        }
        return this;
    }

    

    getLoaders() {
        return this.loaders;
    }

    getSearchResultCount() {
        return this.searchResultCount;
    }

    getVectorDb() {
        return this.vectorDb;
    }

    getDbLookup(){
        return this.dbLookup;
    }

    getTemperature() {
        return this.temperature;
    }

    getEmbeddingRelevanceCutOff() {
        return this.embeddingRelevanceCutOff;
    }

    getQueryTemplate() {
        return this.queryTemplate;
    }

    getCache() {
        return this.cache;
    }

    getEmbeddingModel() {
        return this.embeddingModel;
    }

    getReranker() {
        return this.reranker;
    }

    getModel() {
        return this.model;
    }
}
