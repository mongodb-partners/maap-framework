import { OpenAI, ChatMessage } from 'llamaindex'
import createDebugMessages from 'debug';
import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class LlamaOpenAi extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:OpenAi');
    private readonly modelName: string;
    private readonly maxTokens: number;
    private topP: number;
    private model: OpenAI;

    constructor(params?: { temperature?: number; modelName?: string; maxTokens?: number; topP?: number }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'gpt-3.5-turbo';
        this.maxTokens = params.maxTokens;
        this.topP = params.topP;
    }

    override async init(): Promise<void> {
        this.model = new OpenAI({
            temperature: this.temperature,
            model: this.modelName,
            apiKey: process.env.OPENAI_API_KEY,
            topP: this.topP,
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
        this.debug('OpenAI response -', result);
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