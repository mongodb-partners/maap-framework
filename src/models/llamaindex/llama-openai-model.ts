import { OpenAI, Settings, ChatSummaryMemoryBuffer, ChatMessage, ALL_AVAILABLE_OPENAI_MODELS } from 'llamaindex'
import createDebugMessages from 'debug';
import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';

export class LlamaOpenAi extends BaseModel {
    protected runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any> {
        throw new Error('Method not implemented.');
    }
    private readonly debug = createDebugMessages('maap:model:OpenAi');
    private readonly modelName: string;
    private model: OpenAI;
    private dimensions: number;
    private chatHistory: ChatSummaryMemoryBuffer;

    constructor(params?: { temperature?: number; modelName?: string; }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? 'gpt-3.5-turbo';
        this.dimensions = this.getDefaultDimension(this.modelName);
    }

    private getDefaultDimension(modelName: string): number {
        switch (modelName) {
            case "gpt-3.5-turbo":
                return 4096;
            case "gpt-4o":
                return 16384;
            default:
                throw new Error(`Unknown model: ${modelName}`);
        }
    }

    override async init(): Promise<void> {
        this.model = new OpenAI({ 
            temperature: this.temperature, 
            model: this.modelName, 
            maxTokens: this.dimensions, // CHANGE MAX TOKENS
            azure: { // HOW TO SET FOR ONLY OPEN AI??
                apiKey: process.env.AZURE_OPENAI_API_KEY,
                apiVersion: process.env.AZURE_OPENAI_API_VERSION,
                endpoint: `https://${process.env.AZURE_OPENAI_API_INSTANCE_NAME}.openai.azure.com` 
            }
        }); 
        this.chatHistory = new ChatSummaryMemoryBuffer({ llm: this.model });
        Settings.llm = this.model;
    }

    protected async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[]
    ): Promise<string> {
        const contextSummary = supportingContext.map((chunk) => chunk.pageContent).join('; ');

        this.chatHistory.put({ role: 'system', content: system });
        this.chatHistory.put({ role: 'system', content: `Supporting context: ${contextSummary}` });

        pastConversations.forEach((conversation) => {
            if (conversation.sender === 'AI') {
                this.chatHistory.put({ role: 'assistant', content: conversation.message });
            } else if (conversation.sender === 'SYSTEM') {
                this.chatHistory.put({ role: 'system', content: conversation.message });
            } else {
                this.chatHistory.put({ role: 'user', content: conversation.message });
            }
        });

        // User's query
        this.chatHistory.put({ role: 'user', content: userQuery });

        this.debug('Executing query with prompt:', userQuery);
        this.debug('Chat history:', this.chatHistory.getAllMessages());

        const messages: ChatMessage[] = await this.chatHistory.getAllMessages();

        const response = await this.model.chat({ messages });
        this.debug('Model response:', response);

        if (response.message && typeof response.message.content === 'string') {
            return response.message.content;
        } else {
            throw new Error('Invalid response format from model');
        }
    }
}