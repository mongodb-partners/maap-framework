import { GoogleVertexAIEmbeddings } from "@langchain/community/embeddings/googlevertexai";
import { BaseEmbeddings } from '../../interfaces/base-embeddings.js';

export class GeckoEmbedding implements BaseEmbeddings {
    private model: GoogleVertexAIEmbeddings;
    private modelName: string;

    // constructor() {
    //     this.model = new GoogleVertexAIEmbeddings({model:'textembedding-gecko', maxConcurrency: 3, maxRetries: 5 });
    // }
    constructor(params?: {modelName:string }) {
        this.modelName= params?.modelName ?? 'textembedding-gecko';


        this.model = new GoogleVertexAIEmbeddings({
            model:this.modelName, 
            maxConcurrency: 3, 
            maxRetries: 5 
        });
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
