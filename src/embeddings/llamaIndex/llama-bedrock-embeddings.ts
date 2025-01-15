import { BaseEmbedding } from "llamaindex";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

export class LlamaBedrockEmbeddings extends BaseEmbedding {
  private client: BedrockRuntimeClient;
  private modelName: string;
  private dimension: number;

  constructor(params?: { modelName?: string; dimension?: number }) {
    super();
    this.modelName = params?.modelName ?? "amazon.titan-embed-text-v1";
    this.dimension = params?.dimension ?? 1536;

    // Validate model name and dimension
    if (this.modelName === "amazon.titan-embed-text-v2:0") {
      this.dimension = params?.dimension ?? 1024;
    } else if (this.modelName === "amazon.titan-embed-image-v1") {
      // dimension can be either 256 | 384 | 1024
      this.dimension = params?.dimension ?? 1024;
    }

    // Initialize Bedrock client
    this.client = new BedrockRuntimeClient({
      region: process.env.BEDROCK_AWS_REGION!,
      credentials: {
        accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  getDimensions(): number {
    return this.dimension;
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    if (documents.length === 0) {
      throw new Error("No documents provided for embedding.");
    }

    const embeddings: number[][] = [];

    for (const doc of documents) {
      const command = new InvokeModelCommand({
        modelId: this.modelName,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({ inputText: doc }),
      });

      try {
        const response = await this.client.send(command);
        const payload = JSON.parse(new TextDecoder().decode(response.body));

        if (payload?.embedding) {
          embeddings.push(payload.embedding);
        } else {
          throw new Error(`No embedding found in the response for document: ${doc}`);
        }
      } catch (error) {
        console.error(`Error generating embedding for document: ${doc}`, error);
        throw error;
      }
    }

    return embeddings;
  }


  async getTextEmbedding(text: string): Promise<number[]> {
    try {
      const embeddings = await this.embedDocuments([text]);
      return embeddings[0];
    } catch (error) {
      console.error("Error getting text embedding:", error);
      throw error;
    }
  }
  
  async embedQuery(query: string): Promise<number[]> {
    try {
      return await this.getTextEmbedding(query);
    } catch (error) {
      console.error("Error embedding query:", error);
      throw error;
    }
  }
}
