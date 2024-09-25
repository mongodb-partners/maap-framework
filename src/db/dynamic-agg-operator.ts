import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
dotenv.config();

export class AggMqlOperator {
    private readonly llm: any;
    private queryTemplate: string;
    private jsonSchema: any;

    constructor(params?: { model: any; queryTemplate: string; jsonSchema: any}) {
        try{
            this.llm = params?.model.getModel();
        } catch (e) {
            console.error("Error initializing LLM model: ", e);
            this.llm = null
        }
        this.queryTemplate = params?.queryTemplate;
        this.jsonSchema = params?.jsonSchema;
    }

    public async runQuery(userQuery: string): Promise<string> {

        // order of if conditions on this file is important

        // return query template if alread populated or if it is a static mql query
        if (!JSON.stringify(this.queryTemplate).includes("${")) {
            console.info("Query Template already populated or it is a static mql query");
            return this.queryTemplate;
        }

        if (!this.llm) {
            console.error("LLM model not properly initialized in AggMqlOperator");
            return null;
        }

        if (!this.jsonSchema) {
            console.error("JSON Schema not provided in AggMqlOperator");
            return null;
        }

        const parser = StructuredOutputParser.fromNamesAndDescriptions(this.jsonSchema);

        const chain = RunnableSequence.from([
            PromptTemplate.fromTemplate(
              "Answer the question as per fromat instructions.\nFormat instructions: {format_instructions}\nUser Question : {question}"
            ),
            this.llm,
            parser
        ]);

        const response = await chain.invoke({
            question: userQuery,
            format_instructions: parser.getFormatInstructions(),
        });

        for (let key in response) {
            let value = response[key];
            // find and replace in queryTemplate ${key} with value
            // validate if the ${key} exists in query template if not log an error
            if (!JSON.stringify(this.queryTemplate).includes("${" + key + "}")) {
                console.error("Key not found in query template: ", key);
                return null;
            } else {
                this.queryTemplate = JSON.parse(JSON.stringify(this.queryTemplate).replace("${" + key + "}", value));    
            }
        }

        // check if this.queryTemplate still contains any ${*} in it and log an error and return null
        if (JSON.stringify(this.queryTemplate).includes("${")) {
            console.error("One of the Key not found in query template: ", this.queryTemplate);
            return null;
        }
        // console.info("Final Query Template :: ", JSON.stringify(this.queryTemplate));
        return this.queryTemplate;
    }
    
}