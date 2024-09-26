import createDebugMessages from 'debug';
import { ChatVertexAI } from '@langchain/google-vertexai';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';

import { Chunk, ConversationHistory } from '../global/types.js';
import { BaseModel } from '../interfaces/base-model.js';
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
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('VertexAI response -', result);
        return result.content.toString();
    }

    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const parser = new StringOutputParser();
        return this.model.pipe(parser).stream(pastMessages);
    }

    private generatePastMessages(system: string, supportingContext: Chunk[], pastConversations: ConversationHistory[], userQuery: string) {
        const systemString = system + '\n' + `Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`;
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = [new SystemMessage(systemString)];

        pastMessages.push.apply(
            pastMessages,
            pastConversations.map((c) => {
                if (c.sender === 'AI') return new AIMessage({ content: c.message });
                else if (c.sender === 'SYSTEM') return new SystemMessage({ content: c.message });
                else return new HumanMessage({ content: c.message });
            })
        );
        pastMessages.push(new HumanMessage(`${userQuery}?`));

        this.debug('Executing VertexAI model with prompt -', userQuery);
        return pastMessages;
    }
    public getModel() {
        if (!this.model) {
            this.init();
        }
        return this.model;
    }

}
