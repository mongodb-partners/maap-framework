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
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = [new SystemMessage(system)];
        pastMessages.push(
            new SystemMessage(`Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`),
        );

        pastMessages.push.apply(
            pastMessages,
            pastConversations.map((c) => {
                if (c.sender === 'AI') return new AIMessage({ content: c.message });
                else if (c.sender === 'SYSTEM') return new SystemMessage({ content: c.message });
                else return new HumanMessage({ content: c.message });
            }),
        );
        pastMessages.push(new HumanMessage(`${userQuery}?`));

        this.debug('Executing mistral model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('Mistral response -', result);
        return result.content.toString();
    }
}
