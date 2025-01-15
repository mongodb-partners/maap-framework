import createDebugMessages from 'debug';
import { BedrockChat } from "@langchain/community/chat_models/bedrock";
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';
import { StringOutputParser } from '@langchain/core/output_parsers';

export class Bedrock extends BaseModel {

    private readonly debug = createDebugMessages('maap:model:Bedrock');
    private readonly modelName: string;
    private readonly maxTokens: number;
    private model: BedrockChat;

    constructor(params?: { modelName?: string;  maxTokens?: number; temperature?: number }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName;
        this.maxTokens = params?.maxTokens ?? 2048;
    }

    override async init(): Promise<void> {
        this.model = new BedrockChat({ model: this.modelName, 
            maxTokens: this.maxTokens,
            region: process.env.BEDROCK_AWS_REGION!,
            credentials: {
              accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID!,
              secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY!,
            }
        });
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessagesLangchain(system, supportingContext, pastConversations, userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('Bedrock response -', result);
        return result.content.toString();
    }

    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = this.generatePastMessagesLangchain(system, supportingContext, pastConversations, userQuery);
        const parser = new StringOutputParser();
        return this.model.pipe(parser).stream(pastMessages);
    }

    public getModel() {
        if (!this.model) {
            this.init();
        }
        return this.model;
    }

}
