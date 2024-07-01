import createDebugMessages from 'debug';
// import { AzureOpenAI } from "@langchain/openai";
// import { AzureChatOpenAI } from "@langchain/azure-openai";
import { AzureChatOpenAI } from "@langchain/openai";
// import { ChatOpenAI } from "@langchain/openai";

import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';

export class AzureChatAI extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:AzureOpenAI');
    private readonly azureOpenAIApiInstanceName: string;
    private readonly azureOpenAIApiDeploymentName: string;
    private model: AzureChatOpenAI;
    private readonly azureOpenAIApiVersion: string;

    constructor(params?: { temperature?:number,azureOpenAIApiInstanceName:string, azureOpenAIApiDeploymentName:string, modelName?:string, azureOpenAIApiVersion:string }) {
        super(params?.temperature);
        this.azureOpenAIApiInstanceName= params?.azureOpenAIApiInstanceName;
        this.azureOpenAIApiDeploymentName= params?.azureOpenAIApiDeploymentName;
        this.azureOpenAIApiVersion = params?.azureOpenAIApiVersion;
    }

    override async init(): Promise<void> {
        this.model = new AzureChatOpenAI({
            azureOpenAIApiInstanceName: this.azureOpenAIApiInstanceName,
            azureOpenAIApiDeploymentName: this.azureOpenAIApiDeploymentName,
            azureOpenAIApiVersion: this.azureOpenAIApiVersion,
            temperature: this.temperature
          });
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string> {
        const pastMessages: (AIMessage | SystemMessage | HumanMessage)[] = [
            new SystemMessage(
                `${system}. Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`,
            ),
        ];

        pastMessages.push.apply(
            pastMessages,
            pastConversations.map((c) => {
                if (c.sender === 'AI') return new AIMessage({ content: c.message });
                else if (c.sender === 'SYSTEM') return new SystemMessage({ content: c.message });
                else return new HumanMessage({ content: c.message });
            }),
        );
        pastMessages.push(new HumanMessage(`${userQuery}?`));

        this.debug('Executing AzureOpenAI model with prompt -', userQuery);
        const result = await this.model.invoke(pastMessages);
        this.debug('AzureOpenAI response -', result);
        return result.content.toString();
    }
}
