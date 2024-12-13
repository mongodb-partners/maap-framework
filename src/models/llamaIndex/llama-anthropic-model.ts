import { Anthropic, ChatMessage } from 'llamaindex';
import createDebugMessages from 'debug';
import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class LlamaAnthropic extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:Anthropic');
    private readonly modelName: string;
    private apiKey: string;
    private maxTokens: number;
    private model: Anthropic;

    constructor(params?: { temperature?: number; modelName?: string; apiKey?: string; maxTokens?: number; topP?: number; topK?: number }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'claude-3-sonnet-20240229';
        this.apiKey = params?.apiKey ?? process.env.ANTHROPIC_API_KEY;
        this.maxTokens = params?.maxTokens ?? 2048;
    }

    override async init(): Promise<void> {
        this.model = new Anthropic({
            temperature: this.temperature,
            apiKey: this.apiKey,
            model: this.modelName,
            maxTokens: this.maxTokens,
        });
    }

    private generatePastMessages(
        system: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
        userQuery: string,
    ) {
        const pastMessages: ChatMessage[] = [
            {
                content: `${system}. Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`,
                role: 'system',
            },
        ];

        pastMessages.push(
            ...pastConversations.map((c) => {
                if (c.sender === 'AI') {
                    return { content: c.message, role: 'assistant' } as ChatMessage;
                } else if (c.sender === 'SYSTEM') {
                    return { content: c.message, role: 'system' } as ChatMessage;
                } else {
                    return { content: c.message, role: 'user' } as ChatMessage;
                }
            }),
        );
        pastMessages.push({
            content: `${userQuery}?`,
            role: 'user',
        });

        this.debug('Executing Anthropic model with prompt -', userQuery);
        return pastMessages;
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string> {
        const pastMessages: ChatMessage[] = this.generatePastMessages(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );
        const result = await this.model.chat({ messages: pastMessages });
        this.debug('Anthropic response -', result);
        if (result.message && typeof result.message.content[0]['text'] === 'string') {
            return result.message.content[0]['text'] ;
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
        const pastMessages: ChatMessage[] = this.generatePastMessages(
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
