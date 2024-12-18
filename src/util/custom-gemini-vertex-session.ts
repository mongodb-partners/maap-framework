import { GeminiVertexSession, VertexGeminiSessionOptions } from 'llamaindex';
import {
    GenerativeModel as VertexGenerativeModel,
    GenerativeModelPreview as VertexGenerativeModelPreview,
    type ModelParams as VertexModelParams,
    type StreamGenerateContentResult as VertexStreamGenerateContentResult,
    SafetySetting,
    GenerateContentResponse,
} from '@google-cloud/vertexai';
import { ToolCall } from "@llamaindex/core/llms";


import type { CompletionResponse } from '@llamaindex/core/llms';
import { GeminiChatStreamResponse } from 'llamaindex/llm/gemini/types';

export class CustomGeminiVertexSession extends GeminiVertexSession {
    private safety_settings: SafetySetting[];

    constructor(options?: Partial<VertexGeminiSessionOptions>, safety_settings?: SafetySetting[]) {
        super(options);
        this.safety_settings = safety_settings;
    }

    getGenerativeModel(
        metadata: VertexModelParams,
    ): VertexGenerativeModelPreview | VertexGenerativeModel {
        metadata.safetySettings = this.safety_settings
        return super.getGenerativeModel({...metadata});
    }

    getResponseText(response: GenerateContentResponse): string {
        return super.getResponseText(response)
    }

    getToolsFromResponse(
        response: GenerateContentResponse,
    ): ToolCall[] | undefined {
        return super.getToolsFromResponse(response)
    }

    async *getChatStream(
        result: VertexStreamGenerateContentResult,
    ): GeminiChatStreamResponse {
        return super.getChatStream(result)
    }

    getCompletionStream(
        result: VertexStreamGenerateContentResult,
    ): AsyncIterable<CompletionResponse> {
        return  super.getCompletionStream(result)
    }
}