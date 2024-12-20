import createDebugMessages from 'debug';
import { Ollama, ChatMessage } from 'llamaindex';
import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class LlamaOllama extends BaseModel{
    private readonly debug = createDebugMessages('maap:model:Bedrock');
    private readonly modelName: string;
    private readonly baseUrl: string;
    private model: Ollama;

    constructor(params?: { modelName?: string; baseUrl?: string; temperature?: number; }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params.modelName ?? "llama2";
        this.baseUrl = params.baseUrl ?? "http://localhost:11434";
    }

    override async init(): Promise<void> {
        this.model = new Ollama({
            model: this.modelName,
            options: {
                temperature: this.temperature,
            },
            config: {
                host: this.baseUrl,
            }
        });
    }

    protected async runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string> {
        const pastMessages: ChatMessage[] = this.generatePastMessagesLlama(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );
        const result = await this.model.chat({messages: pastMessages});
        this.debug('Ollama response -', result);
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