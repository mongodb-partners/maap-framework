---
sidebar_position: 1
---

# Internal Demo Setup

## Introduction
This page describes how to setup and showcase a simple RAG bot in order to demonstrate it to customers.

## Setup
Use the below `.config` and `.env` files to setup the demo for external RAG chatbot.

- ### Data
    Update the missing fields with your personal values;
    The source path should be the PDF file location from your local.

- ### Config.yaml
    Update the missing fields with your personal generated values below.


    ````
    ingest:
        - source: 'pdf'
          source_path: '<pdf_file_path>'
          chunk_size: 2000
          chunk_overlap: 200
    embedding:
        class_name: Nomic-v1.5
    vector_store:
        connectionString: '<you_mdb_connection_string>'
        dbName: '<db_name>'
        collectionName: 'embedded_content'
        embeddingKey: 'embedding'
        textKey: 'text'
        numCandidates: 150
        minScore: 0.1 
        vectorSearchIndexName: 'vector_index'
    llms:
        class_name: Fireworks
        model_name: 'accounts/fireworks/models/mixtral-8x22b-instruct'
        temprature: ''
        top_p: ''
        top_k: ''
    ````

    The data here can be loaded from different data sources of your choice.


- ### Environment Variables

Update the FIREWORKS_API_KEY with your personal key or [generate one](https://readme.fireworks.ai/docs/quickstart) if not available.

````
FIREWORKS_API_KEY=
````