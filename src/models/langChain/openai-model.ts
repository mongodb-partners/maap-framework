import createDebugMessages from 'debug';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class OpenAi extends BaseModel {
    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any> {
        throw new Error('Method not implemented.');
    }
    private readonly debug = createDebugMessages('maap:model:OpenAi');
    private readonly modelName: string;
    private model: ChatOpenAI;

    constructor(params?: { temperature?: number; modelName?: string; }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'gpt-3.5-turbo';
    }

    override async init(): Promise<void> {
        this.model = new ChatOpenAI({ temperature: this.temperature, model: this.modelName });
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessagesLangchain(system, supportingContext, pastConversations, userQuery);

        this.debug('Executing openai model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('OpenAI response -', result);
        return result.content.toString();
    }
}
