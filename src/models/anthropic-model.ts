import createDebugMessages from 'debug';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';
import { StringOutputParser } from '@langchain/core/output_parsers';

export class Anthropic extends BaseModel {

    private readonly debug = createDebugMessages('maap:model:Anthropic');
    private readonly modelName: string;
    private readonly maxTokens: number;
    private model: ChatAnthropic;

    constructor(params?: { temperature?: number; modelName?: string; maxTokens?: number; topP?: number; topK?: number }) {
        super(params?.temperature);
        this.modelName = params?.modelName ?? 'claude-3-sonnet-20240229';
        this.maxTokens = params?.maxTokens ?? 2048;
    }

    override async init(): Promise<void> {
        this.model = new ChatAnthropic({ temperature: this.temperature, model: this.modelName, maxTokens:this.maxTokens, apiKey: process.env.ANTHROPIC_API_KEY});
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('Anthropic response -', result);
        return result.content.toString();
        
    }

    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const parser = new StringOutputParser();
        return this.model.pipe(parser).stream(pastMessages);
    }

    private generatePastMessages(system: string, supportingContext: Chunk[], pastConversations: ConversationHistory[], userQuery: string) {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = [
            new SystemMessage(
                `${system}. Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`
            ),
        ];
        pastMessages.push.apply(
            pastMessages,
            pastConversations.map((c) => {
                if (c.sender === 'AI') return new AIMessage({ content: c.message });
                else if (c.sender === 'SYSTEM') return new SystemMessage({ content: c.message });
                else return new HumanMessage({ content: c.message });
            })
        );
        pastMessages.push(new HumanMessage(`${userQuery}?`));

        this.debug('Executing anthropic model with prompt -', userQuery);
        return pastMessages;
    }

    public getModel() {
        return this.model;
    }
}
