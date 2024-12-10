import { LlamaFireworksEmbeddings } from './llama-fireworks-embeddings.js';
import { BaseEmbeddings } from '../../interfaces/base-embeddings.js';

export class LlamaNomicEmbeddingsv1_5 implements BaseEmbeddings {
    private model: LlamaFireworksEmbeddings;

    constructor() {
        this.model = new LlamaFireworksEmbeddings({ modelName: "nomic-ai/nomic-embed-text-v1.5" });
    }

    getDimensions(): number {
        return 768;
    }

    embedDocuments(texts: string[]): Promise<number[][]> {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text: string): Promise<number[]> {
        return this.model.embedQuery(text);
    }
}