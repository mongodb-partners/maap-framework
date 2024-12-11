import md5 from 'md5';
import { Kafka, Consumer } from 'kafkajs';

import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString } from '../util/strings.js';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export class RealTimeDataLoader extends BaseLoader<{ type: 'RealTimeDataLoader' }> {
    private readonly topic: string;
    private readonly kafka: Kafka;
    private readonly consumer: Consumer;
    private readonly tumblingWindow: number;
    private readonly fields: string[];

    constructor({
        topic,
        brokers,
        fields,
        tumblingWindow,
        chunkSize,
        chunkOverlap,
        isRealTime,
        canIncrementallyLoad,
    }: {
        topic: string;
        brokers?: string[];
        fields?: string[];
        tumblingWindow?: number;
        chunkSize?: number;
        chunkOverlap?: number;
        isRealTime?: boolean;
        canIncrementallyLoad?: boolean;
    }) {
        super(
            `RealTimeDataLoader_${md5(topic)}`,
            chunkSize ?? 300,
            chunkOverlap ?? 0,
            isRealTime ?? true,
            canIncrementallyLoad ?? true,
        );
        this.topic = topic;
        this.kafka = new Kafka({
            clientId: 'MAAP-Client',
            brokers: brokers,
        });

        this.consumer = this.kafka.consumer({ groupId: 'real-time-loader-group' });
        this.tumblingWindow = tumblingWindow ?? 600;
        this.fields = fields ?? ['content'];
    }

    override async *getUnfilteredChunks() {
        const chunker = new RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });

        await this.consumer.connect();
        await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });

        // Keep consuming messages indefinitely
        const messagesQueue: any[] = [];
        let keepRunning = true;

        this.consumer.run({
            eachMessage: async ({ topic, message }) => {
                try {
                    console.log(`Received message from topic: ${topic}`);
                    const raw_data = message.value.toString();
                    const jsonData = this.extractJson(raw_data);
                    messagesQueue.push(jsonData);
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            },
        });

        // Generator that yields messages from the queue as chunks
        while (keepRunning) {
            try {
                if (messagesQueue.length > 0) {
                    let data = messagesQueue.shift();
                    let content = '';
                    for (let field of this.fields) {
                        if (data?.fullDocument[field]) {
                            content += data?.fullDocument[field] + ' ';
                        } else if (data[field]) {
                            content += data[field] + ' ';
                        } else {
                            console.warn(`Field with name "${field}" not found in document`);
                        }
                    }
                    // data = data?.fullDocument?.content ? data?.fullDocument?.content : data?.content
                    const chunks = await chunker.splitText(cleanString(content || ''));
                    for (const chunk of chunks) {
                        yield {
                            pageContent: chunk,
                            metadata: {
                                ...data,
                                type: 'RealTimeDataLoader',
                                source: this.topic,
                            },
                        };
                    }
                } else {
                    await new Promise((resolve) => setTimeout(resolve, this.tumblingWindow));
                }
            } catch (e) {
                console.error(
                    `An error occurred trying to parse fields ${this.fields} please check your configuration`,
                );
            }
        }
    }

    extractJson(rawMessage: string): object | null {
        // Find the start of the JSON payload
        const jsonStartIndex = rawMessage.indexOf('{');

        if (jsonStartIndex !== -1) {
            // Extract the JSON part
            const cleanJson = rawMessage.slice(jsonStartIndex);

            try {
                // Parse and return the JSON object
                return JSON.parse(cleanJson);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return null;
            }
        } else {
            console.error('No valid JSON found in the message!');
            return null;
        }
    }

    async stopConsumer() {
        await this.consumer.disconnect();
        console.log('Kafka consumer disconnected.');
    }
}
