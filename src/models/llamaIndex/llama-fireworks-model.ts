import { FireworksLLM, ChatMessage } from 'llamaindex';
import createDebugMessages from 'debug';
import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class LlamaFireworksModel extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:FireworksAI');
    private apiKey: string;
    private readonly modelName: string;
    private maxTokens: number;
    private model: FireworksLLM;
    private topP: number;

    constructor(params?: { temperature?: number; apiKey?: string; modelName?: string; maxTokens?: number; topP?: number }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'accounts/fireworks/models/mixtral-8x7b-instruct';
        this.apiKey = params?.apiKey ?? process.env.FIREWORKS_API_KEY;
        this.maxTokens = params?.maxTokens ?? 2048;
        this.topP = params?.topP ?? 0.5;
    }

    override async init(): Promise<void> {
        this.model = new FireworksLLM({
            temperature: this.temperature,
            apiKey: this.apiKey,
            model: this.modelName,
            maxTokens: this.maxTokens,
            topP: this.topP,
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
        this.debug('FireworksAI response -', result);
        if (result.message && typeof result.message.content === 'string') {
            return result.message.content;
        } else {
            throw new Error('Invalid response format from model');
        }
    }

    override async runStreamQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<any> {
        const pastMessages: ChatMessage[] = this.generatePastMessagesLlama(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );
        const stream = await this.model.chat({ messages: pastMessages, stream: true });
        return stream;
    }

    public getModel() {
        if (!this.model) {
            this.init();
        }
        return this.model;
    }
}
