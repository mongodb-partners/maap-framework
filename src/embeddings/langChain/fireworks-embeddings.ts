import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks";
import { BaseEmbeddings } from '../../interfaces/base-embeddings.js';

export class FireworksEmbedding implements BaseEmbeddings {
    private model: FireworksEmbeddings;
    private readonly modelName: string;
    private dimension: number;

    // model names:
    // nomic-ai/nomic-embed-text-v1.5 (recommended)	137M
    // nomic-ai/nomic-embed-text-v1	137M
    // WhereIsAI/UAE-Large-V1	335M
    // thenlper/gte-large	335M
    // thenlper/gte-base	109M
    constructor(params?: { modelName?: string; dimension?: number }) {
        this.modelName = params?.modelName ?? "nomic-ai/nomic-embed-text-v1.5";
        this.dimension = params?.dimension ?? this.getDefaultDimension(this.modelName);
        this.model = new FireworksEmbeddings({ modelName: this.modelName, maxConcurrency: 3, maxRetries: 5 });
    }

    private getDefaultDimension(modelName: string): number {
        switch (modelName) {
            case "nomic-ai/nomic-embed-text-v1.5":
            case "nomic-ai/nomic-embed-text-v1":
                return 768;
            case "WhereIsAI/UAE-Large-V1":
            case "thenlper/gte-large":
                return 1024;
            case "thenlper/gte-base":
                return 768;
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

