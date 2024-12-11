import { BaseEmbedding } from 'llamaindex';
import { CohereClientV2, Cohere } from 'cohere-ai';

export class LlamaCohereEmbeddings extends BaseEmbedding {
  private modelName: string;
  private dimensions: number;
  private cohere: CohereClientV2;

  /*
    Include this info in the documentation - https://docs.cohere.com/v2/reference/embed
    * Per request there is a maximum of 96 texts.
    * Recommended length of each chunk to be under 512 tokens for optimal quality.
    * truncate defaults to END (Allowed values: NONE|START|END) - For inputs longer than the maximum token length.
  * */

  constructor(params?: { modelName?: string }) {
    super();
    this.modelName = params?.modelName ?? 'embed-english-v2.0';
    this.setDimensions();

    this.cohere = new CohereClientV2({
        token: process.env.COHERE_API_KEY,
    });
  }

  private setDimensions(): void {
    switch (this.modelName) {
      case 'embed-english-v3.0':
        this.dimensions = 1024;
        break;
      case 'embed-english-light-v3.0':
        this.dimensions = 384;
        break;
      case 'embed-english-v2.0':
        this.dimensions = 4096;
        break;
      case 'embed-multilingual-v3.0':
        this.dimensions = 1024;
        break;
      case 'embed-multilingual-light-v3.0':
        this.dimensions = 384;
        break;
      case 'embed-english-light-v2.0':
        this.dimensions = 1024;
        break;
      case 'embed-multilingual-v2.0':
        this.dimensions = 768;
        break;
      default:
        this.dimensions = 4096;
    }
  }

  getDimensions(): number {
    return this.dimensions;
  }

  // Same Name as Langchain
  async embedDocuments(documents: string[]): Promise<number[][]> {
    const MAX_BATCH_SIZE = 96; // Cohere's limit
    const allEmbeddings: number[][] = [];
  
    try { // Split documents into chunks of MAX_BATCH_SIZE
      for (let i = 0; i < documents.length; i += MAX_BATCH_SIZE) {
        const batch = documents.slice(i, i + MAX_BATCH_SIZE);
  
        const response = await this.cohere.embed({
          model: this.modelName,
          texts: batch,
          inputType: Cohere.EmbedInputType.SearchQuery,
          embeddingTypes: ['float'],
        });
  
        // Validate response structure
        if (!response.embeddings.float || !Array.isArray(response.embeddings.float)) {
          throw new Error('Cohere API returned an invalid response structure for embeddings');
        }
  
        // Ensure all embeddings have the correct dimensions
        response.embeddings.float.forEach((embedding: number[]) => {
          if (embedding.length !== this.dimensions) {
            throw new Error(`Expected embedding dimensions of ${this.dimensions}, but got ${embedding.length}`);
          }
        });
  
        // Append batch embeddings
        allEmbeddings.push(...response.embeddings.float);
      }
    } catch (error) {
      console.error('Error embedding documents:', error);
      throw new Error('Failed to embed documents');
    }

    return allEmbeddings;
  }

  async getTextEmbedding(text: string): Promise<number[]> {
    throw new Error('Method not implemented.');
  }
  
  async embedQuery(query: string): Promise<number[]> {
    throw new Error('Method not implemented.');
  }
}