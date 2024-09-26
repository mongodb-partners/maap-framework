---
sidebar_position: 4
---
# Structured Query in MongoDB Atlas

## Introduction

Unlock the power of MongoDB Atlas's LLM-powered Structured Query to create dynamic, intelligent data retrieval systems. This guide walks you through setting up and leveraging Structured Queries to enhance your data operations.

## Key Steps

1. **Create an MQL Query Template**: Design a query with placeholders for dynamic variables.
2. **Define Variables with Descriptions**: Explain each variable in your template for clarity.
3. **Craft a System Prompt for the LLM**: Guide the language model to produce desired results.

## What is an MQL Query Template?

An MQL (MongoDB Query Language) Query Template is a JSON structure containing placeholders for variables. These placeholders (`${variableName}`) are replaced with user-provided values at runtime, enabling flexible and dynamic queries.

**Example:**

```json
[ { "$match": { "$or": [ { "firstName": "${firstName}" }, { "lastName": "${lastName}" } ] } }, { "$project": { "_id": 0, "message": 1 } } ]
```

## What is a System Prompt?

A System Prompt guides the Language Learning Model (LLM) to generate responses that align with your desired output.

**Example:**

```
You are a helpful, human-like chatbot. Use the provided context and chat history to answer queries fully. If you don't know the answer, simply state that you don't know. Avoid mentioning words like "context" or "training data" in your responses.
```

## How Does This Module Work?

The module combines your MQL query template and system prompt to generate a final query. It replaces placeholders with actual values provided by the user, executes the query on your MongoDB Atlas cluster, and returns results to augment your vector search and LLM responses.

### Benefits:

- **Advanced Retrieval Techniques (ART)**: Integrate complex retrieval methods like graph lookups, time series queries, geospatial queries, and full-text searches with vector search.
- **Enhanced Context**: Supplement vector search results with additional data for more informed responses.
- **Stateful Knowledge**: Equip the LLM with real-time data to generate accurate and relevant answers.

## Example ART Query Behaviors:

1. MongoDB _Find Query_ + Vector Search
2. MongoDB _GraphLookup_ + Vector Search
3. MongoDB _Time Series Query_ + Vector Search
4. MongoDB _Geospatial Query_ + Vector Search
5. MongoDB _Full Text Search_ + Vector Search

## Configuration File

The configuration file outlines how your application operates. It includes settings for data ingestion, embedding, vector storage, LLMs, and aggregate operators.

### Sample Config File:

```yaml
ingest:
  - source: 'web'
    source_path: 'https://your-content-source.com/docs/intro'
    chunk_size: 1000
    chunk_overlap: 100

embedding:
  class_name: Nomic-v1.5

vector_store:
  connectionString: '<your_mongodb_connection_string>'
  dbName: '<your_database_name>'
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
  temperature: 0.1

systemPromptPath: '<path_to_your_system_prompt_file>'

stream_options:
  stream: true

aggregate_operators:
  - connectionString: '<your_mongodb_connection_string>'
    dbName: 'test'
    collectionName: 'test'
    aggregatePipelineName: 'testing'
    queryFilePath: '<path_to_your_mql_query_file>'
    variables:
      firstName: 'First name of the person, capitalize first letter'
      lastName: 'Last name of the person, capitalize first letter'
```

## Running the Application

1. **Prepare Your Data**: Ensure your target MongoDB collection is populated with the necessary data.

2. **Ingest Data for Vector Search**: Use the following command to ingest data into your vector search-powered collection:

   ```
   npm run ingest /path/to/your/config.yaml
   ```

3. **Start the Application**: Run the application with your configuration file:

   ```
   npm run start /path/to/your/config.yaml
   ```

---

By following this guide, you can effectively utilize MongoDB Atlas's Structured Query capabilities to build powerful, context-aware applications that meet your clients' needs.