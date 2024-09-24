import createDebugMessages from 'debug';
import { Chunk, ConversationHistory } from '../global/types.js';

export abstract class BaseModel {
    private readonly baseDebug = createDebugMessages('maap:model:BaseModel');
    private static defaultTemperature: number;

    public static setDefaultTemperature(temperature?: number) {
        BaseModel.defaultTemperature = temperature;
    }

    private readonly conversationMap: Map<string, ConversationHistory[]>;
    private readonly _temperature?: number;

    constructor(temperature?: number) {
        this._temperature = temperature;
        this.conversationMap = new Map();
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
        if (!this.conversationMap.has(conversationId)) this.conversationMap.set(conversationId, []);

        const conversationHistory = this.conversationMap.get(conversationId);
        this.baseDebug(`${conversationHistory.length} history entries found for conversationId '${conversationId}'`);
        const result = await this.runQuery(system, userQuery, supportingContext, conversationHistory);

        conversationHistory.push({ message: userQuery, sender: 'HUMAN' });
        conversationHistory.push({
            message: `Old context: ${supportingContext.map((s) => s.pageContent).join('; ')}`,
            sender: 'SYSTEM',
        });
        conversationHistory.push({ message: result, sender: 'AI' });
        return result;
    }

    public async queryStream(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        conversationId: string = 'default',
    ): Promise<any> {
        if (!this.conversationMap.has(conversationId)) this.conversationMap.set(conversationId, []);

        const conversationHistory = this.conversationMap.get(conversationId);
        this.baseDebug(`${conversationHistory.length} history entries found for conversationId '${conversationId}'`);
        return this.runStreamQuery(system, userQuery, supportingContext, conversationHistory);
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
