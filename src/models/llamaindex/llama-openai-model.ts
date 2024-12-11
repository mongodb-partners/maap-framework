import { OpenAI, ChatMessage, ALL_AVAILABLE_OPENAI_MODELS } from 'llamaindex'
import createDebugMessages from 'debug';
import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class LlamaOpenAi extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:OpenAi');
    private readonly modelName: string;
    private model: OpenAI;
    private dimensions: number;

    constructor(params?: { temperature?: number; modelName?: string; }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'gpt-3.5-turbo';
        this.dimensions = this.getDefaultDimension(this.modelName);
    }

    private getDefaultDimension(modelName: string): number {
        switch (modelName) {
            case "gpt-3.5-turbo":
                return 4096;
            case "gpt-4o":
                return 16384;
            default:
                throw new Error(`Unknown model: ${modelName}`);
        }
    }

    override async init(): Promise<void> {
        this.model = new OpenAI({ 
            temperature: this.temperature, 
            model: this.modelName, 
            maxTokens: this.dimensions * 0.75,
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    protected async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[]
    ): Promise<string> {
        const pastMessages: ChatMessage[] = this.generatePastMessagesLlama(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );
        const response = await this.model.chat({ messages: pastMessages });
        this.debug('Model response:', response);

        if (response.message && typeof response.message.content === 'string') {
            return response.message.content;
        } else {
            throw new Error('Invalid response format from model');
        }
    }

    protected async runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any> {
        const pastMessages: ChatMessage[] = this.generatePastMessagesLlama(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );
        return await this.model.chat({ messages: pastMessages, stream: true });
    }
}