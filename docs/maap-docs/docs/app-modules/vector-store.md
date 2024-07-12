---
sidebar_position: 2
---

# Vector Store

MongoDB as the Vector Store.

## Introduction 

Atlas Vector Search lets you search unstructured data. You can create vector embeddings with machine learning models like OpenAI and Hugging Face, and store and index them in Atlas for retrieval augmented generation (RAG), semantic search, recommendation engines, dynamic personalization, and other use cases.


## Setting up 

By following the steps given below you can setup MongoDB to used as a vector store for your RAG application.


    - To get started with MongoDB and building RAG Chatbot with it, you will need to sign-up to [MongoDB Atlas](https://cloud.mongodb.com).

    - You can deploy a cluster (use M0 for free-tier), and start working with it to set up the application. The detailed steps can be found [here](https://www.mongodb.com/docs/guides/atlas/cluster/).

    - Once the Cluster is deployed you will need to feed `config.yaml` file with the below details to complete the setup.

        ```
        vector_store:
            connectionString: '<you_mdb_connection_string>'
            dbName: '<db_name>'
            collectionName: 'embedded_content'
            embeddingKey: 'embedding'
            textKey: 'text'
            numCandidates: 150
            minScore: 0.1 
            vectorSearchIndexName: 'vector_index'
        ```