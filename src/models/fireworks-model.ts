import createDebugMessages from 'debug';
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from "@langchain/core/output_parsers";

import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';

export class Fireworks extends BaseModel {

    private readonly debug = createDebugMessages('maap:model:Fireworks');
    private readonly modelName: string;
    private readonly maxTokens: number;
    private apiKey: string;
    private model: ChatFireworks;

    constructor(params?: { temperature?: number; maxTokens?: number; modelName?: string; apiKey?: string}) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'llama-v3-70b-instruct';
        this.apiKey = params?.apiKey ?? process.env.FIREWORKS_API_KEY;
        this.maxTokens = params?.maxTokens ?? 2048;
    }

    override async init(): Promise<void> {
        this.model = new ChatFireworks({ temperature: this.temperature, maxTokens: this.maxTokens, model: this.modelName, apiKey: this.apiKey});
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

        this.debug('Executing Fireworks model with prompt -', userQuery);
        return pastMessages;
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('Fireworks response -', result);
        return result.content.toString();
    }

    override async runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
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
