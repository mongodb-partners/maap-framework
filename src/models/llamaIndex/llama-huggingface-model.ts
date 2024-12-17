import { HuggingFaceInferenceAPI, ChatMessage, ChatResponse } from 'llamaindex'
import createDebugMessages from 'debug';
import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class LlamaHuggingFace extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:HuggingFace');
    private readonly modelName: string;
    private readonly maxTokens: number;
    private model: HuggingFaceInferenceAPI;

    constructor(params?: { modelName?: string; temperature?: number; maxTokens?: number }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'mistralai/Mixtral-8x7B-Instruct-v0.1';
        this.maxTokens = params?.maxTokens ?? 300;
    }

    override async init(): Promise<void> {
        this.model = new HuggingFaceInferenceAPI({
            model: this.modelName,
            accessToken: process.env.HUGGINGFACE_INFERENCE_API_KEY,
            maxTokens: this.maxTokens,
            temperature: this.temperature,
            verbose: false,
            maxRetries: 1
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

        const result = await this.model.chat({ messages: pastMessages });
        this.debug('HuggingFace response -', result);
        return this.extractAssistantMessage(result);
    }

    protected async runStreamQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[]
    ): Promise<any> {
        const pastMessages: ChatMessage[] = this.generatePastMessagesLlama(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );
        return await this.model.chat({ messages: pastMessages, stream: true });
    }

    private extractAssistantMessage(result: ChatResponse): string {
        const resultParts = (result.message.content as string).split("<|assistant|>");
        return resultParts[resultParts.length - 1];
    }
}
