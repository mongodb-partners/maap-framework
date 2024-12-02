import { FireworksEmbedding, Settings, MessageContentTextDetail } from 'llamaindex';
import { BaseEmbeddings } from '../../interfaces/base-embeddings.js';

export class LlamaFireworksEmbeddings implements BaseEmbeddings {
    private model: FireworksEmbedding;
    private readonly modelName: string;
    private dimension: number;

    constructor() {
        this.modelName = 'nomic-ai/nomic-embed-text-v1.5';
        this.dimension = this.getDefaultDimension();
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

    private getDefaultDimension(): number {
        return 768
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
