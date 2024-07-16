# MongoDB MAAP Chatbot Framework

The MongoDB MAAP Chatbot Framework is a set of libraries that you can use to build your RAG Application
using MongoDB and [Atlas Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/). and associated MAAP partners

The repo offers the flexibility to its user to set up the rag application by simiply configuring a yaml file(details see below). The repo offers the users the flexibilty to choose from various option available through partners program. The following modules of rag are made configurable

1. Data loaders
2. Embedding Models
3. Chat LLM Models
4. Post query Reranker

# Document Preface

The MongoDB MAAP Chatbot Framework documentation provides a comprehensive guide for setting up a Retrieval-Augmented Generation (RAG) application using MongoDB and Atlas Vector Search, along with integration options for various MAAP partners. This framework is designed to be highly configurable, allowing users to tailor their chatbot applications by simply modifying a YAML configuration file. The framework supports customization in four key areas: data loaders, embedding models, chat LLM (Large Language Models) models, and post-query rerankers.

The setup process begins with cloning the project and installing dependencies. This involves navigating to the chatbot directory, building the project locally, and then installing npm packages in the builder/partnerproduct directory.

Configuration of the RAG application is crucial and involves specifying details for data ingestion, embedding models, vector storage, and LLM models in a YAML file. This includes settings for data source types (e.g., PDF files), paths, chunk sizes, embedding class names, MongoDB connection strings, database and collection names, and specifics about the vector search index and LLM models.

The documentation also highlights the process of instantiating embedding and LLM models based on the configuration. Different classes are instantiated based on the specified class_name in the configuration, catering to various services like VertexAI, Azure-OpenAI, Cohere, and others for embeddings, and a similar approach is taken for LLM models with classes like Fireworks, Anthropic, and Bedrock.

Data loaders play a significant role in how data is ingested into the system. The framework supports multiple types of data loaders (e.g., WebLoader, PdfLoader, SitemapLoader, DocxLoader, ConfluenceLoader), each tailored to handle specific data sources like web pages, PDF files, sitemaps, DOCX documents, and Confluence spaces. These loaders are configured with parameters such as source paths and chunking details, and then added to a dataloaders array for processing.

After configuring the application, the user is guided through the process of ingesting data, running the server, and starting the UI client application. The UI client application runs locally, allowing users to interact with the chatbot through a web interface.

This documentation provides a clear and detailed roadmap for developers to set up and customize their RAG applications using the MongoDB MAAP Chatbot Framework, emphasizing flexibility and ease of use through configuration.

-   Setup and Running Demo Video: https://www.youtube.com/watch?v=-r824BdVZt0

-   Internal Chatbot Demo Video: https://drive.google.com/file/d/14gcuJLT2BXhQcS-LpjBqvrSY234x7PK9/view?usp=sharing

# Steps to run the application

1. Clone the project to you machine install dependencies

## Installation

```
cd maap-chabot-builder
npm install
cd builder/partnerproduct
npm install
```

2. Configure RAG application

# Configuration

Edit the config.yaml file to include the necessary details for data ingestion, embedding models, vector storage, and LLM models. The configuration file should include settings for data source types (e.g., PDF files), paths, chunk sizes, embedding class names, MongoDB connection strings, database and collection names, and specifics about the vector search index and LLM models.

For example, the following configuration settings might be included:

```
ingest:
  - source: 'pdf'
    source_path: '<file_path>'
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
```

Also, please make a copy of the `examples/partnerproduct/example.env` file and rename it as `.env`. Place this file in the same folder where you are running your application. In the `.env` file, add the necessary API keys, URLs, connection strings, and any other secrets required for your application.

## Embedding Model

    Instantiation of Embedding Classes:

    * For 'VertexAI', it instantiates GeckoEmbedding without any parameters.
    * For 'Azure-OpenAI-Embeddings', it creates an instance of AzureOpenAiEmbeddings, passing in an object with properties like modelName, deploymentName, apiVersion, and azureOpenAIApiInstanceName, all derived from parsedData.embedding.
    * The 'Cohere' case instantiates CohereEmbeddings with a modelName parameter.
    * 'Titan' leads to the creation of a TitanEmbeddings instance without parameters.
    * Both 'Nomic-v1' and 'Nomic-v1.5' cases instantiate their respective classes, NomicEmbeddingsv1 and NomicEmbeddingsv1_5, without parameters.

## LLM Model

    Each case in the switch corresponds to a different class name (VertexAI, OpenAI, Anyscale, Fireworks, Anthropic, Bedrock). If the class_name matches one of these cases, a new instance of the corresponding class is created and returned. The constructor of each class is called with an object containing a modelName, which is also obtained from parsedData.llms.model_name. modelName corresponds to the LLM Model that is being used as part of the demo

## Data Loaders

    For each case, a new instance of the corresponding loader class (WebLoader, PdfLoader, SitemapLoader, DocxLoader, ConfluenceLoader) is created and configured with parameters extracted from the data object. These parameters typically include the path or URL to the data source (source_path), and may also include settings for how the data should be chunked (chunkSize, chunkOverlap). The newly created loader instance is then added to the dataloaders array for later processing.

    * WebLoader: Used for loading data from web pages. It is initialized with a URL.
    * PdfLoader: Used for loading data from PDF files. It is initialized with a file path.
    * SitemapLoader: Used for loading data from sitemaps. It is initialized with a URL to the sitemap.
    * DocxLoader: Used for loading data from DOCX documents. It is initialized with a file path.
    * ConfluenceLoader: Used for loading data from Confluence spaces. It is initialized with space names and Confluence connection details.

### MAAP Partner Integrations

Partner-specific information can be found below;
Go to [this](https://mongodb-partners.github.io/maap-chatbot-builder/docs/category/partners) page for partner-specific documentation.

| Sr # | MAAP Partner | Partner Type   | Documentation                                                                             |
| ---- | ------------ | -------------- | ----------------------------------------------------------------------------------------- |
| 1    | AWS          | Cloud provider | [Link](https://mongodb-partners.github.io/maap-chatbot-builder/docs/partners/amazon)      |
| 2    | Azure        | Cloud provider | [Link](https://mongodb-partners.github.io/maap-chatbot-builder/docs/partners/azure)       |
| 3    | GCP          | Cloud provider | [Link](https://mongodb-partners.github.io/maap-chatbot-builder/docs/partners/gcp)         |
| 4    | Anthropic    | AI tech        | [Link](https://mongodb-partners.github.io/maap-chatbot-builder/docs/partners/anthropic)   |
| 5    | Anyscale     | AI tech        | [Link](https://mongodb-partners.github.io/maap-chatbot-builder/docs/partners/anyscale)    |
| 6    | Cohere       | AI tech        | [Link](https://mongodb-partners.github.io/maap-chatbot-builder/docs/partners/cohere)      |
| 7    | Fireworks.AI | AI tech        | [Link](https://mongodb-partners.github.io/maap-chatbot-builder/docs/partners/fireworksai) |
| 8    | Langchain    | AI tech        | [Link](https://mongodb-partners.github.io/maap-chatbot-builder/docs/partners/langchain)   |
| 9    | Nomic        | AI tech        | [Link](https://mongodb-partners.github.io/maap-chatbot-builder/docs/partners/nomic)       |

3. Once configured you can use the yaml file you just created say as in example `examples/partnerproduct/src/config_1.yaml`

## Ingest Data

```
npm install
npm run ingest <path to your config.yaml>
```

## Run the server

```
npm run start <path to your config.yaml>
```

4. You can start your UI client application by running the following command

## Start your application UI

```
# in another terminal
cd builder/partnerproduct/ui
npm install
npm run start
```

Your application ui will be running at [http://localhost:3000](http://localhost:3000)

Your application ui will be running at `http://localhost:3000`
