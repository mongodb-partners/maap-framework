import { ChatMessage, Gemini, GEMINI_MODEL, GeminiVertexSession } from 'llamaindex';
import createDebugMessages from 'debug';
import { BaseModel } from '../../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../../global/types.js';
import { HarmBlockThreshold, HarmCategory, SafetySetting } from '@google-cloud/vertexai';
import { CustomGemini } from './miscelaneous/custom-gemini-vertex-model.js';

export class LlamaVertexAI extends BaseModel {
    private readonly debug = createDebugMessages('maap:model:VertexAi');
    private readonly modelName: string;
    //private apiKey: string;
    private model: Gemini;
    private topP: number;
    private maxTokens: number;

    constructor(params?: {
        temperature?: number;
        modelName?: string;
        apiKey?: string;
        maxTokens?: number;
        topP?: number;
        topK?: number;
    }) {
        super(params?.temperature ?? 0.1);
        this.modelName = params?.modelName ?? GEMINI_MODEL.GEMINI_PRO;
        //this.apiKey = params?.apiKey ?? process.env.ANTHROPIC_API_KEY;
        this.topP = params?.topP ?? 0.1;
        this.maxTokens = params.maxTokens;
    }

    override async init(): Promise<void> {
        const entry = Object.entries(GEMINI_MODEL).find(([, enumValue]) => enumValue === this.modelName) as
            | [keyof typeof GEMINI_MODEL, GEMINI_MODEL]
            | undefined;

        const model = entry ? entry[1] : undefined; // Return the enum value
        const safety_settings: SafetySetting[] = [
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
        ];
        // TODO: Once llamaindex support configurable safety_settings (https://github.com/run-llama/LlamaIndexTS/issues/1573) or with a full paid account
        // change this CustomGemini implementation for the Gemini implementation of llama index.
        this.model = new CustomGemini({
            temperature: this.temperature,
            topP: this.topP,
            model: model,
            maxTokens: this.maxTokens,
            session: new GeminiVertexSession({
                location: process.env.GOOGLE_VERTEX_LOCATION,
                project: process.env.GOOGLE_VERTEX_PROJECT,
                googleAuthOptions: {
                    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
                    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
                }
            })
        }, safety_settings); //Safety settings for custom model implementation.
        //console.log(this.model.metadata)
    }

    override async runQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<string> {
        const pastMessages: ChatMessage[] = this.generatePastMessagesLlama(
            system,
            supportingContext,
            pastConversations,
            userQuery,
        );

        const result = await this.model.chat({ messages: pastMessages });
        this.debug('VertexAI response -', result);
        if (result.message && typeof result.message.content === 'string') {
            return result.message.content;
        } else {
            throw new Error('Invalid response format from model');
        }
    }

    override async runStreamQuery(
        system: string,
        userQuery: string,
        supportingContext: Chunk[],
        pastConversations: ConversationHistory[],
    ): Promise<any> {
        // TODO: This should work once LlamaIndex provides support to configurable safety_settings https://github.com/run-llama/LlamaIndexTS/issues/1573
        const pastMessages: ChatMessage[] = this.generatePastMessagesLlama(
             system,
             supportingContext,
             pastConversations,
             userQuery,
         );
        const stream = await this.model.chat({ messages: pastMessages, stream: true });
        return stream;
    }

    public getModel() {
        if (!this.model) {
            this.init();
        }
        return this.model;
    }
}
