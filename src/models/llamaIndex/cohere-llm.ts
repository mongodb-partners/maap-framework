
import { CohereClient } from 'cohere-ai';
import type { ChatRequest } from 'cohere-ai/api';
import {
    BaseLLM,
    type ChatMessage,
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
    // Per completion MistralAI params
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

    chat(
        params: LLMChatParamsStreaming
    ): Promise<AsyncIterable<ChatResponseChunk>>;
    chat(params: LLMChatParamsNonStreaming): Promise<ChatResponse>;

    async chat(
        params: LLMChatParamsStreaming | LLMChatParamsNonStreaming
    ): Promise<AsyncIterable<ChatResponseChunk> | ChatResponse> {
        const client = await this.session.getClient();

        const requestPayload: any = {
            message: this.formatMessages(params.messages),
            model: this.model,
            temperature: this.temperature,
            p: this.topP,
            max_tokens: this.maxTokens,
            stream: params.stream ?? false,
            safe_mode: this.safeMode,
            seed: this.randomSeed,
        };

        //if (params.stream) {
        //    return this.streamChatResponse(client, requestPayload);
        //} else {
            return this.nonStreamingChatResponse(client, requestPayload);
        //}
    }

    private formatMessages(messages: ChatMessage[]): string {
        // Convert messages into a single prompt since Cohere works with strings
        return messages
            .map((msg) => {
                if (msg.role === 'system') {
                    return `[System]: ${msg.content}`;
                } else if (msg.role === 'user') {
                    return `[User]: ${msg.content}`;
                } else if (msg.role === 'assistant') {
                    return `[Assistant]: ${msg.content}`;
                } else {
                    return `[Unknown]: ${msg.content}`;
                }
            })
            .join('\n');
    }

    private async nonStreamingChatResponse(
        client: CohereClient,
        payload: ChatRequest
    ): Promise<ChatResponse> {
        const response = await client.chat(payload);
        return {
            message: {
                role: 'assistant',
                content: response.text,
            },
            raw: {
                response
            }
        };
    }

    /*private async streamChatResponse(
        client: CohereClient,
        payload: ChatRequest
    ): Promise<AsyncIterable<ChatResponseChunk>> {
        const stream = await client.chat(payload, { stream: true });

        const asyncIterable = {
            async *[Symbol.asyncIterator]() {
                for await (const chunk of stream) {
                    yield {
                        message: {
                            role: 'assistant',
                            content: chunk.text,
                        },
                    };
                }
            },
        };

        return asyncIterable;
    }*/

}