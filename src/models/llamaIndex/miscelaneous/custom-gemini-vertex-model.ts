import type { ToolCallLLMMessageOptions } from '@llamaindex/core/llms';

import {
    GEMINI_MODEL,
    type GeminiChatNonStreamResponse,
    type GeminiChatParamsNonStreaming,
    type GeminiChatParamsStreaming,
    type GeminiChatStreamResponse,
    type GeminiMessageRole, IGeminiSession,
} from 'llamaindex/llm/gemini/types';
import { GeminiHelper, getChatContext, mapBaseToolToGeminiFunctionDeclaration } from 'llamaindex/llm/gemini/utils';
import { Gemini } from 'llamaindex';
import { Tokenizers } from '@llamaindex/env/tokenizers';
import { Content, Part, SafetySetting } from '@google-cloud/vertexai';
import { GEMINI_MODEL_INFO_MAP } from 'llamaindex/llm/gemini/base';


const DEFAULT_GEMINI_PARAMS = {
    model: GEMINI_MODEL.GEMINI_PRO,
    temperature: 0.1,
    topP: 1,
    maxTokens: undefined,
};

type CustomLLMMetadata = {
    model: string;
    temperature: number;
    topP: number;
    maxTokens?: number | undefined;
    contextWindow: number;
    tokenizer: Tokenizers | undefined;
    safety_settings: SafetySetting[];
};

export type GeminiConfig = Partial<typeof DEFAULT_GEMINI_PARAMS> & {
    session?: IGeminiSession;
};

export class CustomGemini extends Gemini {
    private readonly safety_settings: SafetySetting[];

    constructor(init?: GeminiConfig, safety_settings?: SafetySetting[]) {
        super(init);
        this.safety_settings = safety_settings;
    }

    get supportToolCall(): boolean {
        return super.supportToolCall;
    }

    get metadata(): CustomLLMMetadata {
        return {
            model: this.model,
            temperature: this.temperature,
            topP: this.topP,
            maxTokens: this.maxTokens,
            contextWindow: GEMINI_MODEL_INFO_MAP[this.model].contextWindow,
            tokenizer: undefined,
            safety_settings: this.safety_settings,
        };
    }

    protected async nonStreamChat(params: GeminiChatParamsNonStreaming): Promise<GeminiChatNonStreamResponse> {
        const context = getChatContext(params);
        const client = this.session.getGenerativeModel(this.metadata);
        const chat = client.startChat(
            params.tools
                ? {
                      history: context.history as Content[],
                      safetySettings: this.safety_settings,
                      tools: [
                          {
                              functionDeclarations: params.tools.map(mapBaseToolToGeminiFunctionDeclaration),
                          },
                      ],
                  }
                : {
                      history: context.history as Content[],
                      safetySettings: this.safety_settings,
                  },
        );
        const { response } = await chat.sendMessage(context.message as Part[]);
        const topCandidate = response.candidates![0]!;

        const tools = this.session.getToolsFromResponse(response);
        const options: ToolCallLLMMessageOptions = tools?.length ? { toolCall: tools } : {};

        return {
            raw: response,
            message: {
                content: this.session.getResponseText(response),
                role: GeminiHelper.ROLES_FROM_GEMINI[topCandidate.content.role as GeminiMessageRole],
                options,
            },
        };
    }

    protected async *streamChat(params: GeminiChatParamsStreaming): GeminiChatStreamResponse {
        const context = getChatContext(params);
        const client = this.session.getGenerativeModel(this.metadata);
        const chat = client.startChat(
            params.tools
                ? {
                      history: context.history as Content[],
                      safetySettings: this.safety_settings,
                      tools: [
                          {
                              functionDeclarations: params.tools.map(mapBaseToolToGeminiFunctionDeclaration),
                          },
                      ],
                  }
                : {
                      history: context.history as Content[],
                      safetySettings: this.safety_settings,
                  },
        );
        const result = await chat.sendMessageStream(context.message as Part[]);
        yield* this.session.getChatStream(result);
    }
}