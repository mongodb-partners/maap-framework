import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { SimpleDirectoryReader } from '@llamaindex/readers/directory';
import md5 from 'md5';

import { BaseLoader } from '../interfaces/base-loader.js';
import { cleanString } from '../util/strings.js';

import { LlamaParseReader } from 'llamaindex';
import 'dotenv/config';

type ParserLanguages = "af" | "az" | "bs" | "cs" | "cy" | "da" | "de" | "en" | "es" | "et" | "fr" | "ga" | "hr" | "hu" | "id" | "is" | "it" | "ku" | "la" | "lt" | "lv" | "mi" | "ms" | "mt" | "nl" | "no" | "oc" | "pi" | "pl" | "pt" | "ro" | "rs_latin" | "sk" | "sl" | "sq" | "sv" | "sw" | "tl" | "tr" | "uz" | "vi" | "ar" | "fa" | "ug" | "ur" | "bn" | "as" | "mni" | "ru" | "rs_cyrillic" | "be" | "bg" | "uk" | "mn" | "abq" | "ady" | "kbd" | "ava" | "dar" | "inh" | "che" | "lbe" | "lez" | "tab" | "tjk" | "hi" | "mr" | "ne" | "bh" | "mai" | "ang" | "bho" | "mah" | "sck" | "new" | "gom" | "sa" | "bgc" | "th" | "ch_sim" | "ch_tra" | "ja" | "ko" | "ta" | "te" | "kn";
type ResultType = "text" | "markdown" ;

export class LlamaIndexLoader extends BaseLoader<{ type: 'LlamaIndexLoader' }> {
    private readonly pathOrUrl: string;
    private readonly parsingInstructions: string;
    private readonly folderProcessing: boolean;
    private readonly language: ParserLanguages;
    private readonly resultType: ResultType;

    constructor({}: {
        url: string;
        chunkSize?: number;
        chunkOverlap?: number;
        parsingInstructions: string;
        folderProcessing: boolean;
        language?: ParserLanguages;
        resultType?: ResultType;
    });
    constructor({}: {
        filePath: string;
        chunkSize?: number;
        chunkOverlap?: number;
        parsingInstructions: string;
        folderProcessing: boolean;
        language?: ParserLanguages;
        resultType?: ResultType;
    });
    constructor({
        filePath,
        url,
        chunkSize,
        chunkOverlap,
        parsingInstructions,
        folderProcessing,
        language,
        resultType
    }: {
        filePath?: string;
        url?: string;
        chunkSize?: number;
        chunkOverlap?: number;
        parsingInstructions?: string;
        folderProcessing?: boolean;
        language?: ParserLanguages;
        resultType?: ResultType;

    }) {
        super(
            `LlamaIndexLoader_${md5(filePath ? `FILE_${filePath}` : `URL_${url}`)}`,
            chunkSize ?? 1000,
            chunkOverlap ?? 0,
        );

        this.pathOrUrl = filePath ?? url;
        this.parsingInstructions = parsingInstructions;
        this.folderProcessing = folderProcessing ?? false;
        this.language = language ?? "en";
        this.resultType = resultType ?? "markdown";
    }

    override async *getUnfilteredChunks() {
        const chunker = new RecursiveCharacterTextSplitter({
            chunkSize: this.chunkSize,
            chunkOverlap: this.chunkOverlap,
        });

        if (this.folderProcessing === true) {
            const reader = new SimpleDirectoryReader();
            const llamaParsedFiles = await reader.loadData({
                directoryPath: this.pathOrUrl,
                numWorkers: 2,
                overrideReader: new LlamaParseReader({
                    language: this.language,
                    resultType: this.resultType,
                    parsingInstruction: this.parsingInstructions as string | undefined,
                    splitByPage: false,
                    isFormattingInstruction: true,
                }),
            });

            for (const llamaParsedFile of llamaParsedFiles) {
                const chunks = await chunker.splitText(cleanString(llamaParsedFile.text));
                for (const chunk of chunks) {
                    yield {
                        pageContent: chunk,
                        metadata: {
                            type: <'LlamaIndexLoader'>'LlamaIndexLoader',
                            source: this.reformatFilePath(this.pathOrUrl),
                        },
                    };
                }
            }
        } else {
            const reader = new LlamaParseReader({
                resultType: 'markdown',
                language: 'en',
                parsingInstruction: this.parsingInstructions as string | undefined,
                splitByPage: false,
                isFormattingInstruction: true,
            });
            const llamaParsedFile = await reader.loadData(this.pathOrUrl);

            const chunks = await chunker.splitText(cleanString(llamaParsedFile.at(0).text));
            for (const chunk of chunks) {
                yield {
                    pageContent: chunk,
                    metadata: {
                        type: <'LlamaIndexLoader'>'LlamaIndexLoader',
                        source: this.reformatFilePath(this.pathOrUrl),
                    },
                };
            }
        }
    }

    reformatFilePath(filePath: string) {
        return `file:///` + filePath.replace(/ /g, '%20');
    }
}
