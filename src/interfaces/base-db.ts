import { ExtractChunkData, InsertChunkData } from '../global/types.js';

export interface BaseDb {
    init({}: { dimensions: number }): Promise<void>;
    insertChunks(chunks: InsertChunkData[]): Promise<number>;
    similaritySearch(query: number[], k: number): Promise<ExtractChunkData[]>;
    hybridSearch(textQuery: string, query: number[], k: number, vectorWeight, fullTextWeight): Promise<ExtractChunkData[]>
    getVectorCount(): Promise<number>;
    createVectorIndex(numDimensions: number): Promise<void>;
    createTextIndex(): Promise<void>;
    docsCount(): Promise<number>;

    deleteKeys(uniqueLoaderId: string): Promise<boolean>;
    reset(): Promise<void>;
}
