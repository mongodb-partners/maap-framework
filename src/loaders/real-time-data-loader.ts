import md5 from 'md5';
import { Kafka, Consumer } from "kafkajs";

import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString } from '../util/strings.js';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export class RealTimeDataLoader extends BaseLoader<{ type: 'RealTimeDataLoader' }> {
    private readonly topic: string;
    private readonly kafka: Kafka;
    private readonly consumer: Consumer;
    private readonly tumblingWindow: number;

    constructor({
                    topic,
                    brokers,
                    tumblingWindow,
                    chunkSize,
                    chunkOverlap,
                    isRealTime,
                    canIncrementallyLoad
                }: {
        topic: string;
        brokers?: string[];
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
            canIncrementallyLoad ?? true
        );
        this.topic = topic;
        this.kafka = new Kafka({
            clientId: 'MAAP-Client',
            brokers: brokers,
        });

        this.consumer = this.kafka.consumer({ groupId: 'real-time-loader-group' });
        this.tumblingWindow = tumblingWindow ?? 600
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
                    const data = JSON.parse(message.value?.toString() || '{}');
                    messagesQueue.push(data);
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            },
        });

        // Generator that yields messages from the queue as chunks
        while (keepRunning) {
            if (messagesQueue.length > 0) {
                const data = messagesQueue.shift();
                const chunks = await chunker.splitText(cleanString(data?.content || ''));
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
        }
    }

    async stopConsumer() {
        await this.consumer.disconnect();
        console.log("Kafka consumer disconnected.");
    }
}
