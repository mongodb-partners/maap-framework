import { BedrockEmbeddings } from "@langchain/aws";
import { BaseEmbeddings } from '../interfaces/base-embeddings.js';

export class BedrockEmbedding implements BaseEmbeddings {
    private model: BedrockEmbeddings;
    private modelName: string;
    private dimension: number;

    constructor(params?: { modelName?: string, dimension: number}) {
        this.modelName = params?.modelName ?? "amazon.titan-embed-text-v1";
        this.dimension = params?.dimension ?? 1024;

        if (this.modelName === "amazon.titan-embed-text-v2:0") {
            this.dimension = params?.dimension ?? 1024;
        } else if (this.modelName === "amazon.titan-embed-image-v1") {
            // dimension can be either 256 | 384 | 1024
            this.dimension = params?.dimension ?? 1024;
        }
        this.model = new BedrockEmbeddings({ region: process.env.BEDROCK_AWS_REGION!,
            credentials: {
              accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
              secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
            },
            model: this.modelName, maxConcurrency: 3, maxRetries: 5 });
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

