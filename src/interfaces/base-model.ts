import createDebugMessages from 'debug';
import { Chunk, ConversationHistory } from '../global/types.js';
import { ChatMessage } from 'llamaindex';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';

export abstract class BaseModel {
    private readonly baseDebug = createDebugMessages('maap:model:BaseModel');
    private static defaultTemperature: number;

    public static setDefaultTemperature(temperature?: number) {
        BaseModel.defaultTemperature = temperature;
    }

    private readonly _temperature?: number;
    private readonly maxTokenLimit: number;
    private readonly charsPerToken: number;

    constructor(temperature?: number) {
        this._temperature = temperature;
        this.maxTokenLimit = 4000;
        this.charsPerToken = 4;
    }

    public get temperature() {
        return this._temperature ?? BaseModel.defaultTemperature;
    }

    public async init(): Promise<void> {}

    public async query(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        conversationId: string = 'default',
    ): Promise<string> {
        //obtain the conversation history from the conversationService from MongoDB chatbot server
        let currentConversationFromConversationService = await (global as any).conversations.findById({ _id: (global as any).currentConversationId });
        let conversationArray: ConversationHistory[] = [];

        //parse the messages types so it matches MAAP's ConversationHistory type
        for (let newMessage of currentConversationFromConversationService.messages) {
            //this variable helps to see if there already is a system message in the conversation history
            const roleExists = conversationArray.some(
                (oldMessage) => oldMessage.sender === 'SYSTEM' && newMessage.role === 'system',
            );
            if (newMessage.role === 'assistant') {
                conversationArray.push({ message: newMessage.content, sender: 'AI' });
                //only add a system message if there is none in the conversation history
            } else if (newMessage.role === 'system' && !roleExists) {
                conversationArray.push({ message: newMessage.content, sender: 'SYSTEM' });
            } else if (newMessage.role === 'user') {
                conversationArray.push({ message: newMessage.content, sender: 'HUMAN' });
            }
        }
        const conversationHistory = this.limitMessagesBasedOnTokenCount(conversationArray);

        //update the user query to include context from the conversation history
        const conversationHistoryContext = `
        Conversation History:
        {${conversationHistory
            .map((s) => (s.sender != 'SYSTEM' ? `[Role:${s.sender}\nContent:${s.message}]` : ''))
            .filter(Boolean)
            .join('\n')}}
        `;
        const [before, after] = userQuery.split('Operational Information:');
        const updatedUserQuery = `${before}\n${conversationHistoryContext.trim()}\nOperational Information:${after}`;

        this.baseDebug(`${conversationHistory.length} history entries found for conversationId '${conversationId}'`);
        const result = await this.runQuery(system, updatedUserQuery, supportingContext, conversationHistory);

        return result;
    }

    public async queryStream(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        conversationId: string = 'default',
    ): Promise<any> {
        //obtain the conversation history from the conversationService from MongoDB chatbot server
        let currentConversationFromConversationService = await (global as any).conversations.findById({ _id: (global as any).currentConversationId });
        let conversationArray: ConversationHistory[] = [];

        //parse the messages types so it matches MAAP's ConversationHistory type
        for (let newMessage of currentConversationFromConversationService.messages) {
            //this variable helps to see if there already is a system message in the conversation history
            const roleExists = conversationArray.some(
                (oldMessage) => oldMessage.sender === 'SYSTEM' && newMessage.role === 'system',
            );
            if (newMessage.role === 'assistant') {
                conversationArray.push({ message: newMessage.content, sender: 'AI' });
                //only add a system message if there is none in the conversation history
            } else if (newMessage.role === 'system' && !roleExists) {
                conversationArray.push({ message: newMessage.content, sender: 'SYSTEM' });
            } else if (newMessage.role === 'user') {
                conversationArray.push({ message: newMessage.content, sender: 'HUMAN' });
            }
        }
        const conversationHistory = this.limitMessagesBasedOnTokenCount(conversationArray);

        //update the user query to include context from the conversation history
        const conversationHistoryContext = `
        Conversation History:
        {${conversationHistory
            .map((s) => (s.sender != 'SYSTEM' ? `[Role:${s.sender}\nContent:${s.message}]` : ''))
            .filter(Boolean)
            .join('\n')}}
        `;
        const [before, after] = userQuery.split('Operational Information:');
        const updatedUserQuery = `${before}\n${conversationHistoryContext.trim()}\nOperational Information:${after}`;

        this.baseDebug(`${conversationHistory.length} history entries found for conversationId '${conversationId}'`);
        return this.runStreamQuery(system, updatedUserQuery, supportingContext, conversationHistory);
    }

    private limitMessagesBasedOnTokenCount(messages: ConversationHistory[]): ConversationHistory[] {
        let trimmedMessages = messages;
        let totalTokens = this.getApproximatedTokenCount(trimmedMessages);

        while (totalTokens > this.maxTokenLimit && trimmedMessages.length > 1) {
            trimmedMessages.splice(1, 2); // remove the second message, preserving the system prompt
            totalTokens = this.getApproximatedTokenCount(trimmedMessages);
        }
        return trimmedMessages;
    }

    private getApproximatedTokenCount(messages: ConversationHistory[]): number {
        const totalChars = messages.reduce((count, message) => count + message.message.length, 0);
        return Math.ceil(totalChars / this.charsPerToken);
    }

    public generatePastMessagesLangchain(
        system: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
        userQuery: string,
    ) {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = [];

        for (let message of pastConversations) {
            const roleExists = pastMessages.some(
                (oldMessage) => oldMessage._getType() === 'system' && message.sender === 'SYSTEM',
            );
            if (message.sender === 'AI') {
                pastMessages.push(new AIMessage({ content: message.message }));
            } else if (message.sender === 'SYSTEM' && !roleExists) {
                pastMessages.push(new SystemMessage({ content: message.message }));
            } else if (message.sender === 'HUMAN') {
                pastMessages.push(new HumanMessage({ content: message.message }));
            }
        }

        pastMessages.push(new HumanMessage(`${userQuery}?`));

        return pastMessages;
    }

    public generatePastMessagesLlama(
        system: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
        userQuery: string,
    ) {
        const pastMessages: ChatMessage[] = [];

        for (let message of pastConversations) {
            const roleExists = pastMessages.some(
                (oldMessage) => oldMessage.role === 'system' && message.sender === 'SYSTEM',
            );
            if (message.sender === 'AI') {
                pastMessages.push({ content: message.message, role: 'assistant' });
            } else if (message.sender === 'SYSTEM' && !roleExists) {
                pastMessages.push({ content: message.message, role: 'system' });
            } else if (message.sender === 'HUMAN') {
                pastMessages.push({ content: message.message, role: 'user' });
            }
        }
        pastMessages.push({
            content: `${userQuery}?`,
            role: 'user',
        });

        return pastMessages;
    }

    protected abstract runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string>;

    protected abstract runStreamQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<any>;
}
