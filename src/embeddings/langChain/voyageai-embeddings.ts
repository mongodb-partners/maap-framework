import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
import { BaseEmbeddings } from '../../interfaces/base-embeddings.js';

export class VoyageAIEmbeddings implements BaseEmbeddings {
    private model: VoyageEmbeddings;
    private modelName: string;
    private dimension: number;

    // model names:
    // nomic-ai/nomic-embed-text-v1.5 (recommended)	137M
    // nomic-ai/nomic-embed-text-v1	137M
    // WhereIsAI/UAE-Large-V1	335M
    // thenlper/gte-large	335M
    // thenlper/gte-base	109M
    constructor(params?: { modelName?: string; dimension?: number }) {
        this.modelName = params?.modelName ?? "voyage-3-lite";
        this.dimension = params?.dimension ?? this.getDefaultDimension(this.modelName);
        this.model = new VoyageEmbeddings({ inputType: "query", 
            modelName: this.modelName,
            apiKey: process.env.VOYAGE_AI_API_KEY,
        });
    }

    private getDefaultDimension(modelName: string): number {
        switch (modelName) {
            case "voyage-3-lite":
                return 512;
            case "voyage-3":
            case "voyage-3-large":
            case "voyage-3.5":
            case "voyage-3.5-lite":
            case "voyage-finance-2":
            case "voyage-multilingual-2":
            case "voyage-large-2-instruct":
            case "voyage-law-2":
            case "voyage-code-3":
                return 1024;
            case "voyage-code-2":
                return 1536;
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

