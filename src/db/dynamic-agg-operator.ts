import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
import { BaseModel } from "../interfaces/base-model.js";

dotenv.config();

export class AggMqlOperator {
    private readonly llm: BaseModel;
    private queryTemplate: string;
    private userQuery: string;
    private zodSchema: z.ZodSchema;

    constructor(params?: { model: BaseModel; queryTemplate: string; userQuery: string, zodSchema: z.ZodSchema }) {
        this.llm = params?.model;
        this.queryTemplate = params?.queryTemplate;
        this.userQuery = params?.userQuery;
        this.zodSchema = params?.zodSchema;
    }

    public async runQuery(): Promise<string> {

        const parser = StructuredOutputParser.fromZodSchema(this.zodSchema);

        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(
              "Answer the users question as best as possible.\n{format_instructions}\n{question}"
            ),
            this.llm.getModel(),
            parser
        ]);

        const response = await chain.invoke({
            question: this.userQuery,
            format_instructions: parser.getFormatInstructions(),
        });

        for (let key in response) {
            let value = response[key];
            // find and replace in queryTemplate ${key} with value
            // validate if the ${key} exists in query template if not log an error
            if (!this.queryTemplate.includes("${" + key + "}")) {
                console.error("Key not found in query template: ", key);
                return null;
            } else {
                this.queryTemplate = this.queryTemplate.replace("${" + key + "}", value);    
            }
        }

        // check if this.queryTemplate still contains any ${*} in it and log an error and return null
        if (this.queryTemplate.includes("${")) {
            console.error("One of the Key not found in query template: ", this.queryTemplate);
            return null;
        }
        return this.queryTemplate;
    }
    
}