---
sidebar_position: 2
---

# Customer Service   
External / public facing customer service app.

## Introduction
This page describes how to setup and showcase a gen AI application for a customer service use-case. 

The data here is being loaded from the web i.e First Cry return policy local `pdf` and `docx` sources. The web link contains a online static page that can be loaded directly.
This usecase setup to demonstrate service where customers can get answers to their greeviances and also guide them with their returns and refund related queries.


## Demo Setup
 Clone the MAAP Framework github repository : [MAAP Framework Github](https://github.com/mongodb-partners/maap-framework/) 

 ### Pre-requisites 
    Before proceeding, ensure that your environment meets the following requirements:
    - Node Version: **v20.0+**
    - MongoDB Version (Atlas): **v7.0 (M10 Cluster Tier)** 
    
    You are also required to generate a `FIREWORKS.AI` API key in order to get access to the model. Visit this [quick-start](https://readme.fireworks.ai/docs/quickstart) guide to generate a key. 

    Once generated, store it in the `.env` file, located at `builder/partnerproduct/.env` as;
    ````
    FIREWORKS_API_KEY=xxxxx
    ````

 ### Components selection
    The first step in the setup process is configuring the `config.yaml` file. You can adjust the necessary settings from the list of available partners to make it best work for your needs. For this demo, we are utilizing the `Nomic` embedding class and the `Mixtral` model for LLMs.
    
    You are required to update the fields as required with your personal generated values below.
    
    _Note: For `pdf` and `docx` files you can use any file of your choice that is locally available._
    ````
    ingest:
        - source: 'web'
          source_path: 'https://www.firstcry.com/returnpolicy'
          chunk_size: 2000
          chunk_overlap: 200
        - source: 'pdf'
          source_path: 'refund_customer_support.pdf'
          chunk_size: 2000
          chunk_overlap: 200
        - source: 'docx'
          source_path: 'refund-policy-template-digital.docx'
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
    ````

 ### Data ingestion    

    The data can be loaded from different data sources of your choice, we are using `pdf`, `docx` and `sitemap` in this case.

    [Link](https://drive.google.com/file/d/1X8cWuZIHzLHnraS4BOBKre0BCPR5SbU4/view?usp=drive_link) to the pdf file used in the demo. Download this pdf file to your machine.
    
    In order to start ingesting the data run the below command.

    ```
    npm run ingest <path_to_your_config.yaml>
    ```

    This command takes into considerations the `ingest` pipeline mentioned in the `config.yaml` file and starts ingesting data from the listed sources. After the data is loaded successfully, the required vector index is also created automatically.

    The data is loaded in `embedded_content` collection, and must have created vector search index named `vector_index`. Verify this before proceeding the to next step.


### Running the application
    In order to start the application, the server and front-end should be running in two separate terminals.

    - #### Run the server
        Navigate to the src folder, and run the server using below command.
        ```
        npm run start <path_to_your_config.yaml>
        ```

    - #### Start your application UI
        You can start your UI client by running the following command.
        ```
        cd builder/partnerproduct/ui
        npm install
        npm run start
        ```
        
        The `npm install` will help you in installing the required libraries.
        
        Your application will be running at [http://localhost:3000](http://localhost:3000).


### Asking questions 

    Be creative and ask questions related to the data you ingested. 