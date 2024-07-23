import createDebugMessages from 'debug';
// import { AzureOpenAI } from "@langchain/openai";
// import { AzureChatOpenAI } from "@langchain/azure-openai";
import { AzureChatOpenAI } from "@langchain/openai";
// import { ChatOpenAI } from "@langchain/openai";

import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';
import { StringOutputParser } from '@langchain/core/output_parsers';

export class AzureChatAI extends BaseModel {

    private readonly debug = createDebugMessages('maap:model:AzureOpenAI');
    private readonly azureOpenAIApiInstanceName: string;
    private readonly azureOpenAIApiDeploymentName: string;
    private model: AzureChatOpenAI;
    private readonly azureOpenAIApiVersion: string;
    private readonly maxTokens: number;
    private readonly topP: number;
    private readonly topK: number;

    constructor(params?: { azureOpenAIApiInstanceName?: string; azureOpenAIApiDeploymentName?: string; azureOpenAIApiVersion?: string; modelName?: string; temperature?: number; maxTokens?: number; topP?:number; topK?:number }) {
        super(params?.temperature ?? 0.1);
        this.azureOpenAIApiInstanceName = params?.azureOpenAIApiInstanceName;
        this.azureOpenAIApiDeploymentName = params?.azureOpenAIApiDeploymentName;
        this.azureOpenAIApiVersion = params?.azureOpenAIApiVersion;
        this.maxTokens = params?.maxTokens ?? 2048;
        this.topP = params?.topP ?? 0.9;
        this.topK = params?.topK ?? 40;

    }

    override async init(): Promise<void> {
        this.model = new AzureChatOpenAI({
            azureOpenAIApiInstanceName: this.azureOpenAIApiInstanceName,
            azureOpenAIApiDeploymentName: this.azureOpenAIApiDeploymentName,
            azureOpenAIApiVersion: this.azureOpenAIApiVersion,
            temperature: this.temperature,
            maxTokens: this.maxTokens,
            topP: this.topP
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
        this.debug('AzureOpenAI response -', result);
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

        this.debug('Executing AzureOpenAI model with prompt -', userQuery);
        return pastMessages;
    }
}
