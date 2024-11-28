import { TogetherAIEmbeddings as LangChainTogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { BaseEmbeddings } from '../../interfaces/base-embeddings.js';

export class TogetherAIEmbeddings implements BaseEmbeddings {
    private model: LangChainTogetherAIEmbeddings;
    private readonly modelName: string;
    private dimension: number;

    constructor(params?: {modelName?: string}) {
        this.modelName = params?.modelName ?? "togethercomputer/m2-bert-80M-8k-retrieval";
        this.dimension = this.getDefaultDimension(this.modelName);
        this.model = new LangChainTogetherAIEmbeddings({apiKey: process.env.TOGETHERAI_API_KEY, modelName: this.modelName});
    }

    private getDefaultDimension(modelName: string): number {
        switch (modelName) {
            case "togethercomputer/m2-bert-80M-2k-retrieval":
            case "togethercomputer/m2-bert-80M-8k-retrieval":
            case "togethercomputer/m2-bert-80M-32k-retrieval":
            case "BAAI/bge-base-en-v1.5":
            case "sentence-transformers/msmarco-bert-base-dot-v5":
            case "bert-base-uncased":
                return 768;
            case "WhereIsAI/UAE-Large-V1":
            case "BAAI/bge-large-en-v1.5":
                return 1024;
            default:
                throw new Error(`Unknown model: ${modelName}`);
        }
    }

    getDimensions(): number {
        return this.dimension;
    }

    embedDocuments(texts: string[]): Promise<number[][]> {
        return this.model.embedDocuments(texts);
    }

    embedQuery(text: string): Promise<number[]> {
        return this.model.embedQuery(text);
    }
}