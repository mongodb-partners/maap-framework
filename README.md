

# Demo Video: https://www.youtube.com/watch?v=-r824BdVZt0

1. Clone the project to you machine install dependencies
## Installation

```
cd chabot
npm build:local
cd examples/partnerproduct
npm install
```

2. Configure RAG application
# Configuration
```
ingest:
    source: 'sitemap'
    source_path: 'https://www.careinsurance.com/sitemap.xml'
    chunk_size: 1000
    chunk_overlap: 100
embedding:
    class_name: Nomic-v1.5
vector_store:
    connectionString: '<mongodb connection string>'
    dbName: '<db_name>'
    collectionName: 'embedded_content'
    embeddingKey: 'embedding'
    textKey: 'text'
    vectorSearchIndexName: 'vector_index'
llms:
    class_name: Fireworks
    model_name: 'accounts/fireworks/models/mixtral-8x22b-instruct'
    temprature: ''
    top_p: ''
    top_k: ''
# rag_pipeline:
#     - vs: ''
#       embedding: embedding
#     - retriver:
#           class_name: multiqueryretriver
#           vs: vs
#           llm: llm
#     - chat_engine: llm
# ingest_pipeline: []

``` 
3. Once configured you can use the yaml file you just created say as in example `examples/partnerproduct/src/config_1.yaml`
## Ingest Data
```
npm install
npm run ingest ./src/config_1.yaml
```

## Run the server
```
npm run start ./src/config_1.yaml
```

## Run the client
```
npm install
npm run client
```

## Run the client with local data
```
npm install
npm run client:local
```

## Run the client with local data and local model
```
npm install
npm run client:local:model
```

## Run the client with local data and local model and local embedding
```
npm install
npm run client:local:model:embedding
```
Your application will be running at `http://localhost:9000`    
4. You can start your UI application by running the following command
## Start your application UI
```
cd ui
npm install
npm run start
```
Your application ui will be running at `http://localhost:3000`

