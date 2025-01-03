import createDebugMessages from 'debug';
import { ChatMessage } from 'llamaindex';
import { BEDROCK_MODEL_MAX_TOKENS, Bedrock } from "@llamaindex/community";
import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class LlamaBedrock extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:Bedrock');
    private modelName: string;
    private maxTokens: number;
    private model: Bedrock;
    private topP: number;

    constructor(params?: { modelName?: string; maxTokens?: number; temperature?: number; topP?: number }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? "meta.llama3-8b-instruct-v1:0";
        this.maxTokens = params?.maxTokens ?? (BEDROCK_MODEL_MAX_TOKENS[this.modelName] * 0.75);
        this.topP = params?.topP ?? 0.1
    }

    override async init(): Promise<void> {
        this.model = new Bedrock({
            model: this.modelName,
            maxTokens: this.maxTokens,
            temperature: this.temperature,
            topP: this.topP,
            region: process.env.BEDROCK_AWS_REGION!,
            credentials: {
                accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
            }
        });
    }

    protected async runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string> {
        const pastMessages: ChatMessage[] = this.generatePastMessagesLlama(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );
        const result = await this.model.chat({messages: pastMessages});
        this.debug('Bedrock response -', result);
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