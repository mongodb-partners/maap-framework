import createDebugMessages from 'debug';
import { ChatCohere } from '@langchain/cohere';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class Cohere extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:Cohere');
    private readonly modelName: string;
    private apiKey: string;
    private model: ChatCohere;

    constructor(params?: { temperature?: number; modelName?: string; apiKey?: string }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'command-r-plus';
        this.apiKey = params?.apiKey ?? process.env.COHERE_API_KEY;
    }

    override async init(): Promise<void> {
        this.model = new ChatCohere({ temperature: this.temperature, model: this.modelName, apiKey: this.apiKey });
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
        this.debug('Cohere response -', result);
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

    public getModel(): ChatCohere {
        if (!this.model) {
            this.init();
        }
        return this.model;
    }
}
