import { BaseModel } from '../../interfaces/base-model.js';
import createDebugMessages from 'debug';
import { Chunk, ConversationHistory } from '../../global/types.js';
import { ChatMessage } from 'llamaindex';
import { CohereLLM } from './miscelaneous/cohere-llm.js';
import { BEDROCK_MODEL_MAX_TOKENS } from '@llamaindex/community';

export class LlamaCohere extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:Cohere');
    private readonly modelName: string;
    private model: CohereLLM;
    private maxTokens: number;
    private topP: number

    constructor(params?: { temperature?: number; modelName?: string; maxTokens?: number; baseUrl?: string; topP?: number }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'command-r-plus';
        this.maxTokens = params?.maxTokens ?? (BEDROCK_MODEL_MAX_TOKENS[this.modelName] * 0.75);
        this.topP = params?.topP ?? 0.5;
    }

    override async init(): Promise<void> {
        this.model = new CohereLLM({
            temperature: this.temperature,
            model: this.modelName,
            apiKey: process.env.COHERE_API_KEY,
            maxTokens: this.maxTokens,
            topP: this.topP
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




