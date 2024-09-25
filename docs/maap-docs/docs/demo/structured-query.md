---
sidebar_position: 4
---

## Introduction

This document will guide you through the process of creating a Structured Query in MongoDB Atlas. where the you can create place holders in your template mql query to be replaced by the values of the variables in the query using the help of configured LLM.

## Steps
1. Create a new MQL query template.
2. Explain the variables in the MQL query template and configure with description as shown in the config below.
3. Create a system prompt to LLM that help you achieve the right persona with the results your are expecting from the chatbot.

## What is MQL Query Template
MQL Query Template is a JSON file that contains a query template with placeholders for variables. The variables are replaced by the values provided by the user in the chatbot.
example
```
 [{"$match": {"$or": [{"fistName": "${firstName}"}, {"lastName": "${lastName}"}]}}, {"$project": {"_id": 0 , "message": 1}}]
```

## What is System Prompt
System Prompt is a text file that contains a prompt for the LLM to generate the right persona with the results your are expecting from the chatbot.
example
```
You are a helpful human like chat bot. Use relevant provided context and chat history to answer the query at the end. Answer in full.
If you don't know the answer, just say that you don't know, don't try to make up an answer. 
Do not use words like context or training data when responding. You can say you do not have all the information but do not indicate that you are not a reliable source.
```

## How does this module work?
The module works by taking the MQL query template and the system prompt as input and generating the final query by replacing the placeholders in the MQL query template with the values provided by the user in the chatbot. The generated query is then executed on the MongoDB Atlas cluster and the results are returned to augment the vector search query and user prompt to the LLM. This chatbot behaviour can drive complex retrival capabilities which can also be termed as Alternate Retrieval Techiniques(ART)
Some Example ART query behaviours:
1. MongoDB find query + vector search
2. MongoDB graphlookup + vector search
3. MonogDB timeseries query + vector search
4. MongoDB geospatial query + vector search
5. MongoDB full text search + vector search

The main focus of this operator is to retrieve information of another analytics or operational collection to suppelment the vector search context. This can enable the stateless LLM to have knowledge of stateful information to interpret and generate response to users queries.

## Config file
The config file is a JSON file that contains the configuration for the application. The configuration file contains the following sections:

- `ingest`: Configuration for the ingestion of the data into the vector search powered collection.

### Config file example

````
ingest:
    - source: 'web'
      source_path: 'https://mongodb-partners.github.io/maap-chatbot-builder/docs/intro'
      chunk_size: 1000
      chunk_overlap: 100
    
embedding:
    class_name: Nomic-v1.5

vector_store:
    connectionString: '<your_mdb_connection_string>'
    dbName: '<db_name>'
    collectionName: 'embedded_content'
    embeddingKey: 'embedding'
    textKey: 'text'
    vectorSearchIndexName: 'vector_index'
    numCandidates: 150
    minScore: 0.6
    limit: 5
    similarityFunction: 'cosine'
llms:
    class_name: Fireworks
    model_name: 'accounts/fireworks/models/llama-v3p1-405b-instruct'
    temprature: 0.1

systemPromptPath: '<your_system_prompt_file_path>'

stream_options:
    stream: true

aggregate_operators:
    - connectionString: "<your_mdb_connection_string>"
      dbName: test
      collectionName: test
      aggregatePipelineName: testing
      queryFilePath: '<your_mql_query_file_path>'
      variables:
        firstName: 'First name of the person, capitalize first letter'
        lastName: 'Last Name of the person,, capitalize first letter'
````

### Running the application
To run the application you have to identify the relevant mongodb collection on which you want to run you structured query configured under `aggregate_operators`. The data to this collection is assumed that you load it your self or you are pointing to pre loaded collection.
You can choose to register multiple such structured query operators

The ingestion of vector search powered collection configured under `vector_store` can be ingested using the 
`npm run ingest /path/to/your/config.yaml`

The application can be run using the command `npm run start /path/to/your/config.yaml`