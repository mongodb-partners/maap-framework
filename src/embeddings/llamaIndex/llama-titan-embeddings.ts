import { LlamaBedrockEmbeddings } from './llama-bedrock-embeddings.js'; 
import { BaseEmbeddings } from '../../interfaces/base-embeddings.js';

export class LlamaTitanEmbeddings implements BaseEmbeddings {
    private model: LlamaBedrockEmbeddings;

    constructor() {
        this.model = new LlamaBedrockEmbeddings({ modelName: "amazon.titan-embed-text-v1", dimension: this.getDimensions() });
    }

    getDimensions(): number {
        return 1536;
    }

    embedDocuments(texts: string[]): Promise<number[][]> {
        return this.model.embedDocuments(texts);
    }
    embedQuery(text: string): Promise<number[]> {
        return this.model.embedQuery(text);
    }
}