import { OpenAI, Settings, ChatMessage, ALL_AVAILABLE_OPENAI_MODELS } from 'llamaindex'
import createDebugMessages from 'debug';
import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class LlamaAzureChatAI extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:AzureOpenAI');
    private readonly azureOpenAIApiInstanceName: string;
    private readonly azureOpenAIApiDeploymentName: string;
    private model: OpenAI;
    private readonly azureOpenAIApiVersion: string;
    private readonly maxTokens: number;
    private readonly topP: number;
    private readonly topK: number;

    constructor(params?: { azureOpenAIApiInstanceName?: string; azureOpenAIApiDeploymentName?: string; azureOpenAIApiVersion?: string; modelName?: string; temperature?: number; maxTokens?: number; topP?:number; topK?:number }) {
        super(params?.temperature ?? 0.1);
        this.azureOpenAIApiInstanceName = params?.azureOpenAIApiInstanceName ?? process.env.AZURE_OPENAI_API_INSTANCE_NAME;
        this.azureOpenAIApiDeploymentName = params?.azureOpenAIApiDeploymentName ?? process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME;
        this.azureOpenAIApiVersion = params?.azureOpenAIApiVersion ?? process.env.AZURE_OPENAI_API_VERSION;
        this.maxTokens = params?.maxTokens ?? 2048;
        this.topP = params?.topP ?? 0.9;
        this.topK = params?.topK ?? 40;
    }

    override async init(): Promise<void> {
        this.model = new OpenAI({
            maxTokens: this.maxTokens,
            temperature: this.temperature,
            topP: this.topP,
            azure: {
                apiKey: process.env.AZURE_OPENAI_API_KEY,
                apiVersion: this.azureOpenAIApiVersion,
                endpoint: `https://${this.azureOpenAIApiInstanceName}.openai.azure.com`,
                deployment: this.azureOpenAIApiDeploymentName,
            }
        });
    }

    protected async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[]
    ): Promise<string> {
        const pastMessages: ChatMessage[] = this.generatePastMessagesLlama(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );
        const result = await this.model.chat({messages: pastMessages});
        this.debug('Bedrock response -', result);
        return result.message.content.toString();
    }

    protected async runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any> {
        const pastMessages: ChatMessage[] = this.generatePastMessagesLlama(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );
        return await this.model.chat({ messages: pastMessages, stream: true });

    }
}