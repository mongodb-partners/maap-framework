import type {
    ToolCallLLMMessageOptions,
} from "@llamaindex/core/llms";
import {
    GEMINI_MODEL,
    type GeminiChatNonStreamResponse,
    type GeminiChatParamsNonStreaming,
    type GeminiChatParamsStreaming,
    type GeminiChatStreamResponse,
    type GeminiMessageRole,
    type GeminiModelInfo,
    type IGeminiSession,
} from 'llamaindex/llm/gemini/types';
import {
    GeminiHelper,
    getChatContext,
} from 'llamaindex/llm/gemini/utils';
import { Gemini } from 'llamaindex';
import { Tokenizers } from '@llamaindex/env/tokenizers';
import { Content, Part, SafetySetting } from '@google-cloud/vertexai';

export const GEMINI_MODEL_INFO_MAP: Record<GEMINI_MODEL, GeminiModelInfo> = {
    [GEMINI_MODEL.GEMINI_PRO]: { contextWindow: 30720 },
    [GEMINI_MODEL.GEMINI_PRO_VISION]: { contextWindow: 12288 },
    // multi-modal/multi turn
    [GEMINI_MODEL.GEMINI_PRO_LATEST]: { contextWindow: 10 ** 6 },
    [GEMINI_MODEL.GEMINI_PRO_FLASH_LATEST]: { contextWindow: 10 ** 6 },
    [GEMINI_MODEL.GEMINI_PRO_1_5_PRO_PREVIEW]: { contextWindow: 10 ** 6 },
    [GEMINI_MODEL.GEMINI_PRO_1_5_FLASH_PREVIEW]: { contextWindow: 10 ** 6 },
    [GEMINI_MODEL.GEMINI_PRO_1_5]: { contextWindow: 2 * 10 ** 6 },
    [GEMINI_MODEL.GEMINI_PRO_1_5_FLASH]: { contextWindow: 10 ** 6 },
    [GEMINI_MODEL.GEMINI_PRO_1_5_LATEST]: { contextWindow: 2 * 10 ** 6 },
    [GEMINI_MODEL.GEMINI_PRO_1_5_FLASH_LATEST]: { contextWindow: 10 ** 6 },
    [GEMINI_MODEL.GEMINI_2_0_FLASH_EXPERIMENTAL]: { contextWindow: 10 ** 6 },
};

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
    private safety_settings

    constructor(init?: GeminiConfig, safety_settings?: SafetySetting[]) {
        super(init);
        this.safety_settings = safety_settings
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
            safety_settings: this.safety_settings
        };
    }

    protected async nonStreamChat(
        params: GeminiChatParamsNonStreaming,
    ): Promise<GeminiChatNonStreamResponse> {
        const context = getChatContext(params);
        const client = this.session.getGenerativeModel(this.metadata);
        const chat = client.startChat({
                history: context.history as Content[],
                safetySettings: this.safety_settings,
                generationConfig: {
                    maxOutputTokens: this.maxTokens,
                    temperature: this.temperature,
                    topP: this.topP
                }
            }
        )
        const { response } = await chat.sendMessage(context.message as Part[]);
        const topCandidate = response.candidates![0]!;

        const tools = this.session.getToolsFromResponse(response);
        const options: ToolCallLLMMessageOptions = tools?.length
            ? { toolCall: tools }
            : {};

        return {
            raw: response,
            message: {
                content: this.session.getResponseText(response),
                role: GeminiHelper.ROLES_FROM_GEMINI[
                    topCandidate.content.role as GeminiMessageRole
                    ],
                options,
            },
        };
    }

    override async *streamChat(
        params: GeminiChatParamsStreaming,
    ): GeminiChatStreamResponse {
        const context = getChatContext(params);
        const client = this.session.getGenerativeModel(this.metadata);
        const chat = client.startChat({
                history: context.history as Content[],
                safetySettings: this.safety_settings,
                generationConfig: {
                    maxOutputTokens: this.maxTokens,
                    temperature: this.temperature,
                    topP: this.topP
                }
            }
        )
        const result = await chat.sendMessageStream(context.message as Part[]);
        yield* this.session.getChatStream(result);
    }
}