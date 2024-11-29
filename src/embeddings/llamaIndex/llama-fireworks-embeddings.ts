import { FireworksEmbedding, Settings } from 'llamaindex';
import { BaseEmbeddings } from '../../interfaces/base-embeddings.js';

export class LlamaFireworksEmbeddings implements BaseEmbeddings {
    private model: FireworksEmbedding;
    private readonly modelName: string;
    private dimension: number;

    /*
    Include this info in the documentation
    * Available embedding models inherited from OpenAIEmbedding class from LlamaIndex.TS
    * "text-embedding-ada-002": {
    dimensions: 1536,
    maxTokens: 8192
  },
  "text-embedding-3-small": {
    dimensions: 1536,
    dimensionOptions: [512, 1536],
    maxTokens: 8192
  },
  "text-embedding-3-large": {
    dimensions: 3072,
    dimensionOptions: [256, 1024, 3072],
    maxTokens: 8192
  }
    * */

    constructor(params?: { modelName?: string; dimension?: number }) {
        this.modelName = params?.modelName ?? 'text-embedding-ada-002';
        this.dimension = params?.dimension ?? this.getDefaultDimension(this.modelName);
        this.model = new FireworksEmbedding({ model: this.modelName, maxRetries: 5 });
    }

    private getDefaultDimension(modelName: string): number {
        switch (modelName) {
            case "text-embedding-ada-002":
            case "text-embedding-3-small":
                return 1536;
            case "text-embedding-3-large":
                return 3072;
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
