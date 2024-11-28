import createDebugMessages from 'debug';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';
import { StringOutputParser } from '@langchain/core/output_parsers';

export class AnyscaleModel extends BaseModel {

    private readonly debug = createDebugMessages('maap:model:AnyscaleLLM');
    private readonly modelName: string;
    private readonly maxTokens: number;
    private model: ChatOpenAI;

    constructor(params?: { temperature?: number; modelName?: string; maxTokens?: number}) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName;
        this.maxTokens = params?.maxTokens ?? 2048;
    }

    override async init(): Promise<void> {
        this.model = new ChatOpenAI({ temperature: this.temperature, maxTokens:this.maxTokens ,model: this.modelName, apiKey: process.env.ANYSCALE_API_KEY ,configuration:{ baseURL: process.env.ANYSCALE_BASE_URL} 
        });
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('OpenAI response -', result);
        return result.content.toString();
    }

    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        const parser = new StringOutputParser();
        return this.model.pipe(parser).stream(pastMessages);
    }
    

    private generatePastMessages(system: string, supportingContext: Chunk[], pastConversations: ConversationHistory[], userQuery: string) {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = [new SystemMessage(system)];
        pastMessages.push(
            new SystemMessage(`Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`)
        );

        pastMessages.push.apply(
            pastMessages,
            pastConversations.map((c) => {
                if (c.sender === 'AI') return new AIMessage({ content: c.message });
                else if (c.sender === 'SYSTEM') return new SystemMessage({ content: c.message });
                else return new HumanMessage({ content: c.message });
            })
        );
        pastMessages.push(new HumanMessage(`${userQuery}?`));

        this.debug('Executing openai model with prompt -', userQuery);
        return pastMessages;
    }

    public getModel() {
        if (!this.model) {
            this.init();
        }
        return this.model;
    }

}
