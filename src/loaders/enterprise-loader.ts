import axios from 'axios';
import { BaseLoader } from '../interfaces/base-loader.js';
import { UnfilteredLoaderChunk } from '../global/types.js';
import { cleanString } from '../util/strings.js';
import md5 from 'md5';
import createDebugMessages from 'debug';
import { JsonLoader } from './json-loader.js';

export class EnterpriseLoader extends BaseLoader<{ type: 'EnterpriseLoader' }> {
    private readonly debug = createDebugMessages('maap:loader:EnterpriseLoader');
    private readonly enterpriseUrl: string;
    private readonly connectorConfig: object;
    private readonly pickKeysForEmbedding: string[];
    private readonly connectorName: string;
    private readonly filterStream: string;
    private readonly requestBody: object;


    constructor({ 
        connectorName,
        connectorConfig,
        filterStream,
        pickKeysForEmbedding
    }: { connectorName: string;
         connectorConfig: object;
         filterStream: string; 
         pickKeysForEmbedding: string[]; }) {
        super(`EnterpriseLoader_${md5(cleanString(JSON.stringify(connectorConfig)))}`);
        this.connectorName = connectorName;
        this.enterpriseUrl = process.env.ENTERPRISE_URL ?? "http://localhost:5000/ab/source";
        this.connectorConfig = connectorConfig;
        this.pickKeysForEmbedding = pickKeysForEmbedding;
        this.filterStream = filterStream;

        this.requestBody = {
            source: this.connectorName,
            config: this.connectorConfig,
            streams: this.filterStream,
        };

    }

    override async *getUnfilteredChunks(): AsyncGenerator<UnfilteredLoaderChunk<{ type: 'EnterpriseLoader' }>, void, void> {
        try {
            const response = await axios.post(this.enterpriseUrl, this.requestBody, {
                headers: {
                    'Accept-Encoding': 'gzip, deflate',
                    'Keep-Alive': '10000',
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data.data;
            this.debug(`Enterprise '${this.enterpriseUrl}' returned ${data.length} entries`);
            
            for (const item of data) {
                const jsonLoader = new JsonLoader({ object: item, pickKeysForEmbedding: this.pickKeysForEmbedding });
                for await (const chunk of jsonLoader.getUnfilteredChunks()) {
                    yield {
                        ...chunk,
                        metadata: {
                            ...chunk.metadata,
                            type: <'EnterpriseLoader'>'EnterpriseLoader',
                            source: response.data.source + ' ' + response.data.stream,
                        },
                    };
                }
            }
        } catch (e) {
            console.log('Could not fetch data from URL', this.enterpriseUrl, e);
            this.debug('Could not fetch data from URL', this.enterpriseUrl, e);
        }
    }
}

