import createDebugMessages from 'debug';
import { ChatTogetherAI } from '@langchain/community/chat_models/togetherai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class TogetherAI extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:TogetherAI');
    private readonly modelName: string;
    private apiKey: string;
    private model: ChatTogetherAI;

    constructor(params?: { temperature?: number; modelName?: string; apiKey?: string }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'mistralai/Mixtral-8x7B-Instruct-v0.1';
        this.apiKey = params?.apiKey ?? process.env.TOGETHERAI_API_KEY;
    }

    override async init(): Promise<void> {
        this.model = new ChatTogetherAI({
            temperature: this.temperature,
            model: this.modelName,
            apiKey: this.apiKey,
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
        this.debug('TogetherAI response -', result);
        return result.content.toString();
    }

    override async runStreamQuery(
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
        const stream = await this.model.pipe(parser).stream(pastMessages);
        return stream;
    }

    public getModel() {
        if (!this.model) {
            this.init();
        }
        return this.model;
    }
}
