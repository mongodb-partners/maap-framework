import { CohereEmbeddings as LangChainCohereEmbeddings } from '@langchain/cohere';

import { BaseEmbeddings } from '../interfaces/base-embeddings.js';

export class CohereEmbeddings implements BaseEmbeddings {
    private model: LangChainCohereEmbeddings;
    private modelName: string;
    private dimensions: number;

    constructor(params?: {modelName?:string}) {
        this.modelName = params?.modelName ?? 'embed-english-v2.0';
        // modelName: embed-english-v3.0 dimensions:1024
        // modelName: embed-english-light-v3.0 dimensions: 384
        // modelName: embed-english-v2.0 dimensions: 4096
        // modelName: embed-multilingual-v3.0	dimensions: 1024
        // modelName: embed-multilingual-light-v3.0 dimensions: 384
        // modelName: embed-english-light-v2.0	dimensions: 1024
        // modelName embed-multilingual-v2.0	dimensions: 768

        if (this.modelName === 'embed-english-v3.0') {
            this.dimensions = 1024;
        } else if (this.modelName === 'embed-english-light-v3.0') {
            this.dimensions = 384;
        } else if (this.modelName === 'embed-english-v2.0') {
            this.dimensions = 4096;
        } else if (this.modelName === 'embed-multilingual-v3.0') {
            this.dimensions = 1024;
        } else if (this.modelName === 'embed-multilingual-light-v3.0') {
            this.dimensions = 384;
        } else if (this.modelName === 'embed-english-light-v2.0') {
            this.dimensions = 1024;
        } else if (this.modelName === 'embed-multilingual-v2.0') {
            this.dimensions = 768;
        } else {
            this.dimensions = 4096;
        }
        this.model = new LangChainCohereEmbeddings({
            model: this.modelName,
            inputType: "search_query",
            maxConcurrency: 3,
            maxRetries: 5,
        });
    }

    getDimensions(): number {
        return this.dimensions;
    }

    embedDocuments(texts: string[]): Promise<number[][]> {
        return this.model.embedDocuments(texts);
    }

    embedQuery(text: string): Promise<number[]> {
        return this.model.embedQuery(text);
    }
}
