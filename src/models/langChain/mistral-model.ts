import createDebugMessages from 'debug';
import { ChatMistralAI } from '@langchain/mistralai';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';

import { Chunk, ConversationHistory } from '../../global/types.js';
import { BaseModel } from '../../interfaces/base-model.js';

export class Mistral extends BaseModel {
    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any> {
        throw new Error('Method not implemented.');
    }
    private readonly debug = createDebugMessages('maap:model:Mistral');
    private model: ChatMistralAI;

    constructor({
        temperature,
        accessToken,
        modelName,
    }: {
        temperature?: number;
        accessToken: string;
        modelName?: string;
    }) {
        super(temperature);
        this.model = new ChatMistralAI({ apiKey: accessToken ?? process.env.MISTRAL_API_KEY, model: modelName ?? 'mistral-medium' });
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessagesLangchain(system, supportingContext, pastConversations, userQuery);

        this.debug('Executing mistral model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('Mistral response -', result);
        return result.content.toString();
    }
}
