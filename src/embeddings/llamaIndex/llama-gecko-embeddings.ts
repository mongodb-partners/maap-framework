import { GoogleAuth } from "google-auth-library";
import axios from "axios";
import { BaseEmbeddings } from "../../interfaces/base-embeddings.js";

export class LlamaGeckoEmbeddings implements BaseEmbeddings {
    private auth: any;
    private client: any;
    private token: any;
    private apiUrl: any;

    constructor(params?: { modelName: string }) {
        const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_NUMBER;
        const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS;
        const LOCATION = "us-central1";
        const MODEL = params?.modelName ?? "textembedding-gecko@003"; //textembedding-gecko-multilingual@001

        this.apiUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict`;

        this.auth = new GoogleAuth({
            keyFilename: CREDENTIALS_PATH,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        });

        this.getClient();

    }

    async getClient(): Promise<void> {
        this.client = await this.auth.getClient();
        this.token = await this.client.getAccessToken();
    }


    getDimensions(): number {
        return 768;
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
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

    embedQuery(text: string): Promise<number[]> {
        throw new Error("Method not implemented.");
    }
}