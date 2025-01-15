import createDebugMessages from 'debug';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';

import { Chunk, ConversationHistory } from '../../global/types.js';
import { BaseModel } from '../../interfaces/base-model.js';
import { StringOutputParser } from '@langchain/core/output_parsers';

export class VertexAI extends BaseModel {

    private readonly debug = createDebugMessages('maap:model:VertexAI');
    private model: ChatVertexAI;

    constructor( params?: { temperature?: number; modelName?: string; maxTokens?: number }) {
        super();
        this.model = new ChatVertexAI({ 
            maxOutputTokens: params?.maxTokens ?? 1024,
            temperature: params?.temperature ?? 0,
            model: params?.modelName ?? 'gemini-1.0-pro' });
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessagesLangchain(system, supportingContext, pastConversations, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('VertexAI response -', result);
        return result.content.toString();
    }

    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessagesLangchain(system, supportingContext, pastConversations, userQuery);
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
