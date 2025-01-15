import { GoogleAuth } from "google-auth-library";
import axios from "axios";
import { BaseEmbeddings } from "../../interfaces/base-embeddings.js";

export class LlamaGeckoEmbeddings implements BaseEmbeddings {
    private auth: GoogleAuth;
    private client: any;
    private token: any;
    private apiUrl: any;
    private isInitialized: boolean = false;

    constructor(params?: { modelName: string }) {
        const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_NUMBER;
        const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const LOCATION = process.env.GOOGLE_VERTEX_LOCATION ??"us-central1";
        const MODEL = params?.modelName ?? "textembedding-gecko@003"; //textembedding-gecko-multilingual@001

        this.apiUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`;

        this.auth = new GoogleAuth({
            keyFilename: CREDENTIALS_PATH,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        });
    }

    private async initialize(): Promise<void> {
        if (!this.isInitialized) {
            this.client = await this.auth.getClient();
            this.token = await this.client.getAccessToken();
            this.isInitialized = true;
        }
    }

    getDimensions(): number {
        return 768;
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        await this.initialize();
        const allEmbeddings: number[][] = [];

        try {
            for (let i = 0; i < texts.length; i++) {
                const requestBody = {
                    instances: [
                        {
                            task_type: "CLUSTERING",
                            content: texts[i],
                        },
                    ],
                };

                const response = await axios.post(this.apiUrl, requestBody, {
                    headers: {
                        Authorization: `Bearer ${this.token.token}`,
                        "Content-Type": "application/json",
                    },
                });

                allEmbeddings.push(response.data.predictions[0].embeddings.values);
            }

        } catch (error) {
            console.error('Error embedding documents:', error);
            throw new Error('Failed to embed documents');
        }

        return allEmbeddings;
    }

    async embedQuery(text: string): Promise<number[]> {
        await this.initialize();
        const embeddings = await this.embedDocuments([text]);
        return embeddings[0];
    }
}