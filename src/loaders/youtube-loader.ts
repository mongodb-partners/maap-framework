import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { YoutubeTranscript } from 'youtube-transcript';
import createDebugMessages from 'debug';
import md5 from 'md5';

import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString } from '../util/strings.js';

export class YoutubeLoader extends BaseLoader<{ type: 'YoutubeLoader' }> {
    private readonly debug = createDebugMessages('maap:loader:YoutubeLoader');
    private readonly videoIdOrUrl: string;

    constructor({
        videoIdOrUrl,
        chunkSize,
        chunkOverlap,
    }: {
        videoIdOrUrl: string;
        chunkSize?: number;
        chunkOverlap?: number;
    }) {
        super(`YoutubeLoader_${md5(videoIdOrUrl)}`, chunkSize ?? 2000, chunkOverlap ?? 100);
        this.videoIdOrUrl = videoIdOrUrl;
    }

    override async *getUnfilteredChunks() {
        const chunker = new RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });

        try {
            // const transcripts = await YoutubeTranscript.fetchTranscript(this.videoIdOrUrl, { lang: 'en' });
            const transcripts = await YoutubeTranscript.fetchTranscript(this.videoIdOrUrl);
            console.log(`Transcripts (length ${transcripts.length}) obtained for video`, this.videoIdOrUrl);

            // Consolidate all transcripts into one string to be split into larger chunks
            const overallTranscript = transcripts.reduce((accumulator, transcript) => {
                return accumulator + transcript.text;
            }, '');
            
            // Split the overall transcript into chunks
            for (const chunk of await chunker.splitText(cleanString(overallTranscript))) {
                yield {
                    pageContent: chunk,
                    metadata: {
                        type: <'YoutubeLoader'>'YoutubeLoader',
                        source: this.videoIdOrUrl,
                    },
                };
            }

        } catch (e) {
            this.debug('Could not get transcripts for video', this.videoIdOrUrl, e);
        }
    }
}
