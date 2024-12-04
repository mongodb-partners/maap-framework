import { BaseEmbeddings } from "../../interfaces/base-embeddings.js";


export class LlamaGeckoEmbeddings implements BaseEmbeddings {
    //private model: ;

    getDimensions(): number {
        return 768;
    }
    embedDocuments(texts: string[]): Promise<number[][]> {
        throw new Error("Method not implemented.");
    }
    embedQuery(text: string): Promise<number[]> {
        throw new Error("Method not implemented.");
    }   
}