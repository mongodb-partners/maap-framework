import AWS from 'aws-sdk';
import createDebugMessages from 'debug';
import { BaseModel } from '../interfaces/base-model.js';
import { Chunk, ConversationHistory } from '../global/types.js';
import { StringOutputParser } from '@langchain/core/output_parsers';

const sagemaker = new AWS.SageMakerRuntime({region: 'us-east-1'});
AWS.config.update({ region: 'us-east-1' });

export class SageMaker extends BaseModel {

    private readonly debug = createDebugMessages('maap:model:SageMaker');
    private readonly maxTokens: number;
    private readonly sagemakerEndpoint: string;
    private readonly topP: number;
    
    constructor(params?: { temperature?: number; sagemakerEndpoint?: string; maxTokens?: number; topP?: number; topK?: number; region?: string }) {
        super(params?.temperature);
        this.sagemakerEndpoint = params?.sagemakerEndpoint;
        this.topP = params?.topP ?? 0.9;
        this.maxTokens = params?.maxTokens ?? 2048;
        AWS.config.update({ region: params?.region });
    }

    private generatePastMessages(system: string, supportingContext: Chunk[], pastConversations: ConversationHistory[], userQuery: string) {
        const pastMessages = [
            {"role": "system", "content": (
                `${system}. Supporting context: ${supportingContext.map((s) => s.pageContent).join('; ')}`
            )},
        ];

        pastMessages.push.apply(
            pastMessages,
            pastConversations.map((c) => {
                if (c.sender === 'AI') return {"role": "ai", "content": c.message};
                else if (c.sender === 'SYSTEM') return {"role": "system", "content": c.message};
                else return {"role": "human", "content": c.message};
            })
        );
        pastMessages.push({"role": "human", "content": userQuery});

        this.debug('Executing Sagemaker model with prompt -', userQuery);
        return pastMessages;
    }


    async runQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<string> {
        const pastMessages = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        
        const input_data = {
            "messages": pastMessages,
            "max_tokens": this.maxTokens,
            "temperature": this.temperature,
            "top_p": this.topP,
            "stop": ["~~~~~~"],
        }

        const payload = JSON.stringify(input_data)

        const params = {
            EndpointName: this.sagemakerEndpoint,
            Body: payload,
            ContentType: 'application/json'
        };

        try {
            const result = await sagemaker.invokeEndpoint(params).promise();
            const response = JSON.parse(result['Body'].toString('utf-8'));
            return response['choices'][0]['message']['content'];
        } catch (error) {
            console.error('Error invoking SageMaker endpoint:', error);
            throw error;
        }
    }

    
    async runStreamQuery(system: string, userQuery: string, supportingContext: Chunk[], pastConversations: ConversationHistory[]): Promise<any> {
        // TODO : Implement the stream query 
        const pastMessages = this.generatePastMessages(system, supportingContext, pastConversations, userQuery);
        
        const input_data = {
            "messages": pastMessages,
            "max_tokens": this.maxTokens,
            "temperature": this.temperature,
            "top_p": this.topP,
            "stop": ["~~~~~~"],
        }

        const payload = JSON.stringify(input_data)

        const params = {
            EndpointName: this.sagemakerEndpoint,
            Body: payload,
            ContentType: 'application/json'
        };
        return new Promise(async (resolve, reject) => {
            try {
                const result = await sagemaker.invokeEndpointWithResponseStream(params).promise();
                const chunks = [];
                for await (const event of result['Body']) {
                    if (event['PayloadPart']) {
                        const chunkText = event['PayloadPart']['Bytes'].toString('utf-8').trim();
                        if (chunkText) {
                            const chunk = { text: chunkText };                          
                            chunks.push(chunk);
                        }
                    }
                    else {
                        console.log('No payload part found in event:', event);
                    }
                }
                resolve(chunks);
            } catch (error) {
                console.error('Error invoking SageMaker endpoint for stream:', error);
                reject(error);
            }
        });
    }

}