import createDebugMessages from 'debug';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';
import { StringOutputParser } from '@langchain/core/output_parsers';

export class NvidiaModel extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:NvidiaNIM');
    private readonly modelName: string;
    private readonly maxTokens: number;
    private readonly topP: number;
    private readonly frequencyPenalty: number;
    private readonly presencePenalty: number;
    private model: ChatOpenAI;

    constructor(params?: {
        temperature?: number;
        modelName?: string;
        maxTokens?: number;
        topP?: number;
        frequencyPenalty?: number;
        presencePenalty?: number;
    }) {
        super(params?.temperature ?? 0.6); // Default temperature for NVIDIA models
        this.modelName = params?.modelName ?? 'nvidia/llama-3.1-nemotron-70b-instruct';
        this.maxTokens = params?.maxTokens ?? 4096;
        this.topP = params?.topP ?? 0.95;
        this.frequencyPenalty = params?.frequencyPenalty ?? 0;
        this.presencePenalty = params?.presencePenalty ?? 0;
    }

    override async init(): Promise<void> {
        this.model = new ChatOpenAI({
            temperature: this.temperature,
            maxTokens: this.maxTokens,
            model: this.modelName,
            apiKey: process.env.NVIDIA_API_KEY,
            configuration: { baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'},
            modelKwargs: {
                top_p: this.topP,
                frequency_penalty: this.frequencyPenalty,
                presence_penalty: this.presencePenalty,
            },
        });
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessagesLangchain(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );
        const result = await this.model.invoke(pastMessages);
        this.debug('OpenAI response -', result);
        return result.content.toString();
    }

    protected runStreamQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<any> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessagesLangchain(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );
        const parser = new StringOutputParser();
        return this.model.pipe(parser).stream(pastMessages);
    }

    public getModel() {
        if (!this.model) {
            this.init();
        }
        return this.model;
    }
}
