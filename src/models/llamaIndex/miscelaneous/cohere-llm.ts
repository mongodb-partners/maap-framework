import { Cohere, CohereClient } from 'cohere-ai';
import type { ChatRequest } from 'cohere-ai/api';
import {
    BaseLLM,
    type ChatResponse,
    type ChatResponseChunk,
    type LLMChatParamsNonStreaming,
    type LLMChatParamsStreaming,
} from 'llamaindex';

export const ALL_AVAILABLE_COHERE_MODELS = {
    'command-r-plus': { contextWindow: 128000 },
    'command-r': { contextWindow: 128000 },
};

export class CohereSession {
    apiKey?: string;
    private client?: CohereClient;

    constructor(init?: Partial<CohereSession>) {
        if (!init?.apiKey) {
            throw new Error('Set Cohere API key');
        }
        this.apiKey = init.apiKey;
    }

    async getClient() {
        if (!this.client) {
            this.client = new CohereClient({
                token: this.apiKey,
            });
        }
        return this.client;
    }
}

/**
 * Cohere LLM implementation
 */
export class CohereLLM extends BaseLLM {
    model: string; //keyof typeof ALL_AVAILABLE_COHERE_MODELS;
    temperature: number;
    topP: number;
    maxTokens?: number;
    apiKey?: string;
    safeMode: boolean;
    randomSeed?: number;

    private session: CohereSession;

    constructor(init?: Partial<CohereLLM>) {
        super();
        this.model = init?.model ?? 'command-r-plus';
        this.temperature = init?.temperature ?? 0.1;
        this.topP = init?.topP ?? 1;
        this.maxTokens = init?.maxTokens ?? undefined;
        this.safeMode = init?.safeMode ?? false;
        this.randomSeed = init?.randomSeed ?? undefined;
        this.session = new CohereSession(init);
    }

    get metadata() {
        return {
            model: this.model,
            temperature: this.temperature,
            topP: this.topP,
            maxTokens: this.maxTokens,
            contextWindow: ALL_AVAILABLE_COHERE_MODELS[this.model].contextWindow,
            tokenizer: undefined,
        };
    }

    chat(params: LLMChatParamsStreaming): Promise<AsyncIterable<ChatResponseChunk>>;
    chat(params: LLMChatParamsNonStreaming): Promise<ChatResponse>;

    async chat(
        params: LLMChatParamsStreaming | LLMChatParamsNonStreaming,
    ): Promise<AsyncIterable<ChatResponseChunk> | ChatResponse> {
        const client = await this.session.getClient();

        const requestPayload: any = {
            message: params.messages[params.messages.length - 1].content.toString(),
            chatHistory: params.messages.slice(0, -1).map(({ content, role }) => ({
                message: content,
                role: role === 'assistant' ? 'chatbot' : role,
            })),
            model: this.model,
            temperature: this.temperature,
            p: this.topP,
            max_tokens: this.maxTokens,
            stream: params.stream ?? false,
            safe_mode: this.safeMode,
            seed: this.randomSeed,
        };

        if (params.stream) {
            return this.streamChatResponse(client, requestPayload);
        }

        return this.nonStreamingChatResponse(client, requestPayload);
    }

    private async nonStreamingChatResponse(client: CohereClient, payload: ChatRequest): Promise<ChatResponse> {
        const response = await client.chat(payload);
        return {
            message: {
                role: 'assistant',
                content: response.text,
            },
            raw: {
                response,
            },
        };
    }

    private async streamChatResponse(
        client: CohereClient,
        payload: ChatRequest,
    ): Promise<AsyncIterable<ChatResponseChunk>> {
        const stream = await client.chatStream(payload);

        return {
            async *[Symbol.asyncIterator]() {
                for await (const chunk of stream) {
                    if (chunk.eventType === 'text-generation') {
                        yield {
                            raw: chunk,
                            delta: (chunk as Cohere.StreamedChatResponse.TextGeneration).text,
                        };
                    } else if (chunk.eventType === 'stream-end') {
                        yield {
                            raw: chunk,
                            delta: '',
                        };
                    }
                }
            },
        };
    }
}