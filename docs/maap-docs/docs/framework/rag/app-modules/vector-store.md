---
sidebar_position: 2
---

# Document Store

MongoDB as the Document Store.

 

Atlas Vector Search lets you search unstructured data. You can create vector embeddings with machine learning models like OpenAI and Hugging Face, and store and index them in Atlas for retrieval augmented generation (RAG), semantic search, recommendation engines, dynamic personalization, and other use cases.


## Setting up 

### Vector Store
By following the steps given below you can setup MongoDB to be used as a vector store for your gen AI application.


    - To get started with MongoDB and building gen AI application with it, you will need to sign-up to [MongoDB Atlas](https://cloud.mongodb.com).

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

### ODL (Operational Data Layer)

Follow the below steps to setup MongoDB as an operational data layer; 

    - The setup requires 2 files to be created; 

        1. Query file;
            This is a `txt` file containing the operational query to be made to MongoDB.
            Eg. 
                ```
                    [{"$match": {"$or": [{"fistName": "John"}, {"lastName": "Doe"}]}}, {"$project": {"_id": 0 , "message": 1}}]
                ```

        2. System Prompt file;
            The prompt to be provided for the LLM, this can be modified based on the needs of the application and how the LLM should respond.
            Eg.
                ```
                You are a helpful human like chat bot. Use relevant provided context and chat history to answer the query at the end. Answer in full. 
                If you don't know the answer, just say that you don't know, don't try to make up an answer. 
                Do not use words like context or training data when responding. You can say you do not have all the information but do not indicate that you are not a reliable source.
                ```


    -  Once the above files are in place, add the following in `config.yaml` file with updated values; 

            ```
            aggregate_operators:
                - connectionString: "<your_mdb_connection_string>"
                dbName: '<db_name>'
                collectionName: '<collection_name>'
                aggregatePipelineName: '<pipeline_name>'
                queryFilePath: '<your_mql_query_file_path>'

            systemPromptPath: '<your_system_prompt_file_path>'

            ```




