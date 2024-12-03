import { TogetherEmbedding, Settings, MessageContentTextDetail } from "llamaindex";
import { BaseEmbeddings } from "../../interfaces/base-embeddings.js";

/*
Unable to access non-serverless model:
    - sentence-transformers/msmarco-bert-base-dot-v5 
    - bert-base-uncased
*/

export class LlamaTogetherAIEmbeddings implements BaseEmbeddings {
    private model: TogetherEmbedding;
    private readonly modelName: string;
    private dimension: number;

    constructor(params?: { modelName?: string }) {
        this.modelName = params?.modelName ?? "togethercomputer/m2-bert-80M-8k-retrieval";
        this.dimension = this.getDefaultDimension(this.modelName);
        this.model = new TogetherEmbedding({
            model: this.modelName,
            maxRetries: 5,
            apiKey: process.env.TOGETHER_AI_API_KEY,
        });
        Settings.embedModel = this.model;
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

    async embedDocuments(texts: string[]): Promise<number[][]> {
        try {
            return await this.model.getTextEmbeddings(texts);
        } catch (error) {
            console.error("Error embedding documents:", error);
            throw error;
        }
    }

    async embedQuery(text: string): Promise<number[]> {
        try {
            return await this.model.getTextEmbeddings([text]).then(embeddings => embeddings[0]);
        } catch (error) {
            console.error("Error embedding query:", error);
            throw error;
        }
    }
}