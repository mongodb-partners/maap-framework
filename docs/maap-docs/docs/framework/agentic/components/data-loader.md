# Data Loader

## Introduction
The `maap-data-loader` project is designed to streamline data ingestion and processing for the MongoDB Atlas Application Partner (MAAP) program. This tool provides a robust mechanism to load, transform, and manage data efficiently, ensuring seamless integration with MongoDB Atlas. It supports both structured and unstructured data processing, with built-in support for document processing, embeddings generation, and integration with various AI services.

## Features
- **Document Processing**: Automated processing of various document formats
- **Embedding Generation**: Built-in support for generating embeddings using AI services
- **MongoDB Integration**: Direct integration with MongoDB Atlas for efficient data storage
- **Configurable Pipeline**: Flexible pipeline configuration for different data processing needs
- **Logging System**: Comprehensive logging system for tracking operations
- **Enterprise Support**: Dedicated enterprise features for large-scale deployments

## Project Structure
The project is organized as follows:

```
maap-data-loader/
├── app.py                 # Main application entry point
├── config.py             # Global configuration settings
├── Dockerfile            # Container definition for deployment
├── requirements.txt      # Python dependencies
├── enterprise/          # Enterprise-specific implementations
│   ├── mongodb_ingest.py     # MongoDB ingestion logic
│   ├── pipeline_executor.py  # Data pipeline execution
│   └── util/                 # Enterprise utilities
│       ├── base_configs.py   # Base configuration classes
│       ├── builder.py        # Pipeline builder
│       └── configs/          # Configuration components
│           ├── downloader.py # Data download configurations
│           ├── indexer.py    # Indexing configurations
│           └── source.py     # Data source configurations
├── local/               # Local development components
│   ├── database/        # Database interactions
│   ├── models/          # Data models and schemas
│   ├── services/        # Core services
│   │   ├── bedrock_service.py    # AWS Bedrock integration
│   │   ├── document_service.py   # Document processing
│   │   └── embedding_service.py  # Embedding generation
│   └── utils/           # Utility functions
```

## Prerequisites
- Python 3.8 or higher
- MongoDB Atlas account
- Docker (for containerized deployment)
- AWS account (for Bedrock service integration)
- Sufficient storage for document processing

## Setup Instructions

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/mongodb-partners/maap-data-loader.git
   cd maap-data-loader
   ```

2. **Quick Setup Using Make**  
   The project includes a Makefile for common operations. To get started quickly:
   ```bash
   # View all available commands
   make help

   # Set up virtual environment and install dependencies
   make setup

   # Install additional development dependencies
   make install-dev
   ```

   For other operations:
   ```bash
   make test        # Run tests
   make lint        # Run linting and formatting
   make run         # Run the application
   make clean       # Clean up build artifacts
   make docker-build # Build Docker image
   make docker-run  # Run Docker container
   make logs        # View application logs
   make backup      # Backup processed data
   ```

3. **Manual Setup**  
   If not using Makefile, perform the following steps:

   1. **Set Up Python Environment**  
      ```bash
      python -m venv venv
      source venv/bin/activate  # On Windows: venv\Scripts\activate
      pip install -r requirements.txt
      ```

   2. **Configure Environment Variables**  
      Create a `.env` file in the root directory with the following variables:
      ```
      MONGODB_URI=your_mongodb_connection_string
      AWS_ACCESS_KEY_ID=your_aws_access_key
      AWS_SECRET_ACCESS_KEY=your_aws_secret_key
      AWS_REGION=your_aws_region
      ```

   3. **Configure Application Settings**  
      Update `config.py` with your specific settings:
      - Database configurations
      - Processing pipeline settings
      - Document processing parameters
      - Embedding service configurations

   4. **Run the Application**  
      ```bash
      python app.py
      ```

## Usage Examples

# MAAP Data Loader - cURL Examples

These examples demonstrate how to interact with the MAAP Data Loader API using cURL commands.

## Health Check
Check if the API service is running:

```bash
curl -X GET http://localhost:8000/health
```

Expected response:
```json
{"status": "healthy"}
```

## Upload Files (PDF, DOCX, etc.)
Upload files for processing and embedding generation:

```bash
curl -X POST http://localhost:8000/local/upload \
  -H "Content-Type: multipart/form-data" \
  -F "files=@/path/to/your/document.pdf" \
  -F 'json_input_params={
    "user_id": "user123",
    "mongodb_config": {
      "uri": "mongodb+srv://username:password@cluster.mongodb.net",
      "database": "maap_db",
      "collection": "documents",
      "index_name": "vector_index",
      "text_field": "text",
      "embedding_field": "embedding"
    }
  }'
```

## Process Web Pages
Process web content without file upload:

```bash
curl -X POST http://localhost:8000/local/upload \
  -H "Content-Type: multipart/form-data" \
  -F 'json_input_params={
    "user_id": "user123",
    "mongodb_config": {
      "uri": "mongodb+srv://username:password@cluster.mongodb.net",
      "database": "maap_db",
      "collection": "documents",
      "index_name": "vector_index",
      "text_field": "text",
      "embedding_field": "embedding"
    },
    "web_pages": ["https://www.mongodb.com/docs", "https://www.mongodb.com/atlas"]
  }'
```

## Handling Responses

Successful response example:
```json
{
  "success": true,
  "message": "Successfully processed 3 documents",
  "details": {
    "processed_files": ["document1.pdf", "document2.docx", "document3.txt"],
    "documents_count": 3
  }
}
```

Error response example:
```json
{
  "success": false,
  "error": "Invalid MongoDB URI",
  "traceback": null
}
```

## Enterprise API Examples

### Register a New Source

#### Local File System
Register a local file system as a data source:

```bash
curl --location --request GET 'localhost:8182/register/source' \
--header 'Content-Type: application/json' \
--data-raw '{
  "sync_interval_seconds": 360,
  "source": {
    "source_type": "local",
    "params": {
      "remote_url": "<source-url-folder-path>",
      "chunking_strategy": "by_title",
      "chunk_max_characters": "1500",
      "chunk_overlap": "100"
    }
  },
  "destination": {
    "mongodb_uri": "<your-mongodb-connection-string>",
    "database": "<your-db-name>",
    "collection": "<your-collection-name>",
    "index_name": "default",
    "embedding_path": "embeddings",
    "embedding_dimensions": 1536,
    "id_fields": ["field1", "field2"],
    "create_md5": true,
    "batch_size": 100
  }
}'
```

#### AWS S3 Bucket
Register an AWS S3 bucket as a data source:

```bash
curl --location --request GET 'localhost:8182/register/source' \
--header 'Content-Type: application/json' \
--data-raw '{
  "sync_interval_seconds": 360,
  "source": {
    "source_type": "s3",
    "credentials": {
      "aws_access_key_id": "<your-aws-access-key-id>",
      "aws_secret_access_key": "<your-aws-secret-key>",
      "aws_session_token": "<your-aws-session-token>"
    },
    "params": {
      "remote_url": "<source-url-folder-path>",
      "chunking_strategy": "by_title",
      "chunk_max_characters": "1500",
      "chunk_overlap": "100"
    }
  },
  "destination": {
    "mongodb_uri": "<your-mongodb-connection-string>",
    "database": "<your-db-name>",
    "collection": "<your-collection-name>",
    "index_name": "default",
    "embedding_path": "embeddings",
    "embedding_dimensions": 1536,
    "id_fields": ["field1", "field2"],
    "create_md5": true,
    "batch_size": 100
  }
}'
```

#### Google Drive
Register a Google Drive folder as a data source:

```bash
curl --location --request GET 'localhost:8182/register/source' \
--header 'Content-Type: application/json' \
--data-raw '{
  "sync_interval_seconds": 360,
  "source": {
    "source_type": "google-drive",
    "credentials": {
      "gcp_service_account_key_string": "<gcp_service_account_key_string>",
      "google_drive_folder_id": "<google_drive_folder_id>"
    },
    "params": {
      "remote_url": "<source-url-folder-path>",
      "chunking_strategy": "by_title",
      "chunk_max_characters": "1500",
      "chunk_overlap": "100"
    }
  },
  "destination": {
    "mongodb_uri": "<your-mongodb-connection-string>",
    "database": "<your-db-name>",
    "collection": "<your-collection-name>",
    "index_name": "default",
    "embedding_path": "embeddings",
    "embedding_dimensions": 1536,
    "id_fields": ["field1", "field2"],
    "create_md5": true,
    "batch_size": 100
  }
}'
```

Expected response for all source registrations:
```json
{
  "message": "Source registered successfully"
}
```

## Monitoring and Logging
- Logs are stored in `local/logs/MAAP-Loader.log`
- Monitor MongoDB operations through Atlas dashboard
- Check processing status in application logs

## Container Deployment
Build and run using Docker:
```bash
docker build -t maap-data-loader .
docker run -d --env-file .env maap-data-loader
```

## Architecture
```
+------------------------+
|     Data Sources       |
| (Files, APIs, Streams) |
+------------------------+
           ↓
+------------------------+
|   Document Processor   |
| (Parse, Clean, Format) |
+------------------------+
           ↓
+------------------------+
|  Embedding Generator   |
| (AI Service Integration)|
+------------------------+
           ↓
+------------------------+
|   MongoDB Atlas        |
| (Storage & Indexing)   |
+------------------------+
```

## Detailed Architecture
```mermaid
graph TB
    subgraph Input ["Data Input Layer"]
        DS["Data Sources"] --> FU["File Upload"]
    end

    subgraph Processing ["Processing Layer"]
        direction TB
        subgraph ES["Enterprise Services"]
            PE["Pipeline Executor"] --> MI["MongoDB Ingest"]
            PE --> BC["Base Configs"]
            BC --> DL["Downloader"]
            BC --> IX["Indexer"]
            BC --> SC["Source Config"]
        end

        subgraph LS["Local Services"]
            DS1["Document Service"] --> BS["Bedrock Service"]
            DS1 --> ES1["Embedding Service"]
        end
    end

    subgraph Storage ["Storage Layer"]
        MD["MongoDB"] --> UF["Uploaded Files"]
        MD --> LOG["Logs"]
    end

    subgraph Utils ["Utility Layer"]
        EU["Error Utils"] --> LG["Logger"]
        FUT["File Utils"] --> LG
    end

    Input --> Processing
    Processing --> Storage
    Utils --> Processing
    Utils --> Storage

    classDef primary fill:#2374AB,stroke:#2374AB,color:white
    classDef secondary fill:#68A2CA,stroke:#68A2CA,color:white
    classDef tertiary fill:#95B8D3,stroke:#95B8D3,color:white
    classDef quaternary fill:#B8D0E1,stroke:#B8D0E1,color:black

    class DS,FU primary
    class PE,MI,DS1,BS,ES1 secondary
    class MD,UF,LOG tertiary
    class EU,FUT,LG quaternary
```

### Component Description

#### Input Layer
- **Data Sources**: Various input sources including files, APIs, and streams
- **File Upload**: Handles file ingestion and initial validation

#### Processing Layer
- **Enterprise Services**
  - Pipeline Executor: Orchestrates data processing workflows
  - MongoDB Ingest: Handles data ingestion into MongoDB
  - Configuration Components: Manages processing settings
- **Local Services**
  - Document Service: Processes and transforms documents
  - Bedrock Service: AWS Bedrock integration for AI capabilities
  - Embedding Service: Generates embeddings for documents

#### Storage Layer
- **MongoDB**: Primary data store
- **Uploaded Files**: Temporary storage for processed files
- **Logs**: Application logging and monitoring

#### Utility Layer
- **Error Utils**: Error handling and reporting
- **File Utils**: File system operations
- **Logger**: Logging and monitoring utilities

## Best Practices
- Always use virtual environments
- Keep sensitive information in environment variables
- Regular backup of processed data
- Monitor system resources during large-scale processing
- Use appropriate indexes in MongoDB for better query performance

## Troubleshooting
Common issues and solutions:
1. **Connection Errors**: Verify MongoDB URI and network connectivity
2. **Memory Issues**: Check document size and processing batch size
3. **Processing Errors**: Verify file formats and permissions
4. **AWS Integration**: Confirm AWS credentials and permissions

## Contributing
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description
4. Ensure tests pass and code meets style guidelines

## License
This project is licensed under the MIT License - see the LICENSE file for details.