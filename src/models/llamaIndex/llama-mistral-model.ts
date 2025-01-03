import { MistralAI, ChatMessage, Settings, ALL_AVAILABLE_MISTRAL_MODELS, MistralAISession } from 'llamaindex';
import createDebugMessages from 'debug';
import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class LlamaMistral extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:MistralAI');
    private readonly modelName: string;
    private apiKey: string;
    private model: MistralAI;
    private maxTokens: number;

    constructor(params?: {
        temperature?: number;
        modelName?: string;
        accessToken?: string;
        maxTokens?: number;
    }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'mistral-medium';
        this.apiKey = params?.accessToken ?? process.env.MISTRAL_API_KEY;
        this.maxTokens = params?.maxTokens ?? 2048;
    }

    override async init(): Promise<void> {
        type MistralModelKeys = keyof typeof ALL_AVAILABLE_MISTRAL_MODELS;
        let model = (this.modelName in ALL_AVAILABLE_MISTRAL_MODELS
            ? this.modelName as MistralModelKeys
            : 'mistral-medium' as MistralModelKeys);
        Settings.llm = new MistralAI({model: model, apiKey: this.apiKey})
        this.model = new MistralAI({
            temperature: this.temperature,
            model: model,
            apiKey: this.apiKey,
            maxTokens: this.maxTokens,
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
        this.debug('MistralAI response -', result);
        if (result.message && typeof result.message.content[0]['text'] === 'string') {
            return result.message.content[0]['text'];
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
