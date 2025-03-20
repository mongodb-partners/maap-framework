import OpenAI from 'openai';
import { BaseEmbeddings } from '../../interfaces/base-embeddings.js';
export class NvidiaEmbeddings implements BaseEmbeddings {
    private client: OpenAI;
    private model: string;
    private truncate: string;
    private encodingFormat: "float" | "base64";
    private maxConcurrency: number;
    private requestQueue: Promise<any>[] = [];
    private inputType?: "query" | "passage";
    
    constructor(options?: {
        apiKey?: string;
        baseURL?: string;
        model?: string;
        truncate?: "NONE" | "START" | "END";
        encodingFormat?: "float" | "base64";
        maxConcurrency?: number;
        inputType?: "query" | "passage";
    }) {
        // Create the OpenAI client
        this.client = new OpenAI({
            apiKey: options?.apiKey || process.env.NVIDIA_API_KEY || '',
            baseURL: options?.baseURL ||process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
            maxRetries: 5,
        });
        
        // Default model is now llama-3.2-nv-embedqa-1b-v2
        this.model = options?.model || 'nvidia/llama-3.2-nv-embedqa-1b-v2';
        this.truncate = options?.truncate || 'NONE';
        this.encodingFormat = options?.encodingFormat || 'float';
        this.maxConcurrency = options?.maxConcurrency || 3;
        this.inputType = options?.inputType|| "query";
    }
    getDimensions(): number {
        // Return dimensions based on model
        switch (this.model) {
            case 'nvidia/llama-3.2-nv-embedqa-1b-v2':
                return 2048;
            case 'baai/bge-m3':
                return 1024;
            case 'nvidia/nv-embedqa-e5-v5':
                return 1024;
            case 'nvidia/nv-embed-v1':
                return 4096;
            case 'snowflake/arctic-embed-l':
                return 1024;
            case 'nvidia/embed-qa-4':
                return 1024;
            default:
                return 2048; // Default to llama-3.2-nv-embedqa-1b-v2 dimensions
        }
    }
    private async manageConcurrency<T>(task: () => Promise<T>): Promise<T> {
        // Simple concurrency management
        if (this.requestQueue.length >= this.maxConcurrency) {
            await Promise.race(this.requestQueue);
        }
        
        const promise = task();
        this.requestQueue.push(promise);
        
        promise.finally(() => {
            const index = this.requestQueue.indexOf(promise);
            if (index !== -1) this.requestQueue.splice(index, 1);
        });
        
        return promise;
    }
    private createEmbeddingParams(inputs: string | string[]) {
        // Create base params
        const params: Record<string, any> = {
            input: inputs,
            model: this.model,
            encoding_format: this.encodingFormat,
        };
        
        // For models that need truncate and input_type
        const needsExtraParams = [
            'nvidia/llama-3.2-nv-embedqa-1b-v2',
            'nvidia/nv-embedqa-e5-v5',
            'nvidia/nv-embed-v1',
            'snowflake/arctic-embed-l',
            'nvidia/embed-qa-4'
        ].includes(this.model);
        
        if (needsExtraParams) {
            // Add truncate directly to params
            params.truncate = this.truncate;
            
            // Add input_type if specified
            if (this.inputType) {
                params.input_type = this.inputType;
            }
        } else if (this.model === 'baai/bge-m3') {
            // For bge-m3, truncate is a direct parameter
            params.truncate = this.truncate;
        }
        
        return params;
    }
    async embedDocuments(texts: string[]): Promise<number[][]> {
        if (texts.length === 0) return [];
        
        return this.manageConcurrency(async () => {
            // Default to passage type for documents if not specified
            const originalInputType = this.inputType;
            if (!this.inputType) {
                this.inputType = "passage";
            }
            
            try {
                const params = this.createEmbeddingParams(texts);
                const response = await this.client.embeddings.create(params as any);
                return response.data.map(item => item.embedding);
            } finally {
                this.inputType = originalInputType;
            }
        });
    }
    async embedQuery(text: string): Promise<number[]> {
        return this.manageConcurrency(async () => {
            // Save the original input type
            const originalInputType = this.inputType;
            
            // Temporarily set input type to "query" for this operation
            this.inputType = "query";
            
            try {
                const params = this.createEmbeddingParams([text]);
                const response = await this.client.embeddings.create(params as any);
                return response.data[0].embedding;
            } finally {
                // Restore the original input type
                this.inputType = originalInputType;
            }
        });
    }
    // Helper method to create passage embeddings specifically
    async embedPassage(text: string): Promise<number[]> {
        return this.manageConcurrency(async () => {
            // Save the original input type
            const originalInputType = this.inputType;
            
            // Temporarily set input type to "passage" for this operation
            this.inputType = "passage";
            
            try {
                const params = this.createEmbeddingParams([text]);
                const response = await this.client.embeddings.create(params as any);
                return response.data[0].embedding;
            } finally {
                // Restore the original input type
                this.inputType = originalInputType;
            }
        });
    }
}