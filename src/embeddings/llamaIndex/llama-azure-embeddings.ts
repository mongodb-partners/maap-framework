import { OpenAIEmbedding, Settings } from 'llamaindex';
import { BaseEmbeddings } from '../../interfaces/base-embeddings.js';

export class LlamaAzureEmbeddings implements BaseEmbeddings {
    private model: OpenAIEmbedding;
    private modelName: string;
    private dimensions: number;
    private azureOpenAIApiInstanceName: string;
    private apiVersion: string;

    constructor(params?: {
        deploymentName?: string, apiVersion?: string, azureOpenAIApiInstanceName?: string, modelName: string
    }) {
        this.azureOpenAIApiInstanceName = params?.azureOpenAIApiInstanceName ?? process.env.AZURE_OPENAI_API_INSTANCE_NAME;
        this.modelName = params?.modelName ?? 'text-embedding-ada-002';
        this.azureOpenAIApiInstanceName = params?.deploymentName ?? process.env.AZURE_OPENAI_API_INSTANCE_NAME
        this.apiVersion = params?.apiVersion ?? process.env.AZURE_OPENAI_API_VERSION;

        if (this.modelName === 'text-embedding-3-small') {
            this.dimensions = 1536;
        } else if (this.modelName === 'text-embedding-3-large') {
            this.dimensions = 3072;
        } else {
            this.dimensions = 1536;
        }
        this.model = new OpenAIEmbedding({
            dimensions: this.dimensions,
            model: this.modelName,
            maxRetries: 5,
            azure: {
                apiKey: process.env.AZURE_OPENAI_API_KEY,
                endpoint: `https://${this.azureOpenAIApiInstanceName}.openai.azure.com`,
                apiVersion: this.apiVersion,
                deployment: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME
            }
        });
        Settings.embedModel = this.model;
    }

    getDimensions(): number {
        return this.dimensions;
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