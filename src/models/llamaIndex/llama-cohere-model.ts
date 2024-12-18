import { BaseModel } from '../../interfaces/base-model.js';
import createDebugMessages from 'debug';
import { Chunk, ConversationHistory } from '../../global/types.js';
import { ChatMessage } from 'llamaindex';
import { CohereLLM } from './cohere-llm.js';

export class LlamaCohere extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:Cohere');
    private readonly modelName: string;
    private model: CohereLLM;

    constructor(params?: { temperature?: number; modelName?: string; maxTokens?: number; baseUrl?: string }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'command-r-plus';
    }

    override async init(): Promise<void> {
        this.model = new CohereLLM({
            temperature: this.temperature,
            model: this.modelName,
            apiKey: process.env.COHERE_API_KEY,
        });
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string> {
        const pastMessages: ChatMessage[] = this.generatePastMessagesLlama(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );
        const result = await this.model.chat({ messages: pastMessages });
        this.debug('Cohere response -', result);
        return result.message.content.toString();
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




