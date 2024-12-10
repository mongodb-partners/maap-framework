import { FireworksEmbedding, Settings, MessageContentTextDetail } from 'llamaindex';
import { BaseEmbeddings } from '../../interfaces/base-embeddings.js';

export class LlamaFireworksEmbeddings implements BaseEmbeddings {
    private model: FireworksEmbedding;
    private readonly modelName: string;
    private dimension: number;

    constructor(params?: { modelName?: string; dimension?: number }) {
        this.modelName = params?.modelName ?? "nomic-ai/nomic-embed-text-v1.5";
        this.dimension = params?.dimension ?? this.getDefaultDimension(this.modelName);
        Settings.embedModel = new FireworksEmbedding({
            model: this.modelName,
            maxRetries: 5,
            apiKey: process.env.FIREWORKS_API_KEY,
        });
        this.model = new FireworksEmbedding({
            model: this.modelName,
            maxRetries: 5,
            apiKey: process.env.FIREWORKS_API_KEY,
        });
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
        return this.model.getTextEmbeddings(texts);
    }

    embedQuery(text: string): Promise<number[]> {
        const messageContent: MessageContentTextDetail = {
            text: text,
            type: 'text',
        };
        return this.model.getQueryEmbedding(messageContent);
    }
}
