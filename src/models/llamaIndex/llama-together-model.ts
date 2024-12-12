import { ChatMessage, TogetherLLM } from 'llamaindex';
import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';
import createDebugMessages from 'debug';

export class LlamaTogetherAI extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:TogetherAI');
    private readonly modelName: string;
    private readonly apiKey: string;
    private readonly maxTokens: number;
    private model: TogetherLLM;

    constructor(params?: { temperature?: number; modelName?: string; apiKey?: string; maxTokens?: number }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'mistralai/Mixtral-8x7B-Instruct-v0.1';
        this.apiKey = params?.apiKey ?? process.env.TOGETHER_AI_API_KEY;
        this.maxTokens = params?.maxTokens ?? 2048;
    }

    override async init(): Promise<void> {
        this.model = new TogetherLLM({
            temperature: this.temperature,
            model: this.modelName,
            apiKey: this.apiKey,
            maxTokens: this.maxTokens,
        });
    }

    protected async runQuery(
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
        this.debug('TogetherAI response -', result);
        return result.message.content.toString();
    }

    protected async runStreamQuery(
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
        return await this.model.chat({ messages: pastMessages, stream: true });
    }
}