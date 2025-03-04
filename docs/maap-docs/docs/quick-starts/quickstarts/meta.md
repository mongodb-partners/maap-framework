# MongoDB - Meta Quickstart

The MongoDB - Meta Quickstart is a comprehensive, integrated end-to-end technology stack meticulously designed to facilitate the rapid development and seamless deployment of AI-powered Agentic applications. This innovative framework combines the robust capabilities of MongoDB Atlas for scalable data storage and advanced vector search functionalities with Meta's Llama AI state-of-the-art language models for powerful natural language processing and generation.

## Table of Contents
- [1. Overview](#1-overview)
- [2. System Architecture](#2-system-architecture)
- [3. Components](#3-components)
  - [3.1 UI Service](#31-ui-service)
  - [3.2 Main Service](#32-main-service)
  - [3.3 AI Memory Service](#33-ai-memory-service)
  - [3.4 Semantic Cache Service](#34-semantic-cache-service)
  - [3.5 Loader Service](#35-loader-service)
  - [3.6 Logger Service](#36-logger-service)
  - [3.7 MongoDB Management Scripts](#37-mongodb-management-scripts)
- [4. Installation & Deployment](#4-installation--deployment)
  - [4.1 One-Click Deployment](#41-one-click-deployment)
  - [4.2 Manual Deployment](#42-manual-deployment)
- [5. Configuration](#5-configuration)
  - [5.1 Environment Variables](#51-environment-variables)
  - [5.2 MongoDB Atlas Configuration](#52-mongodb-atlas-configuration)
- [6. Usage](#6-usage)
  - [6.1 User Interface](#61-user-interface)
  - [6.2 Uploading Documents](#62-uploading-documents)
  - [6.3 Querying the System](#63-querying-the-system)
- [7. API Reference](#7-api-reference)
  - [7.1 Main Service API](#71-main-service-api)
  - [7.2 AI Memory API](#72-ai-memory-api)
  - [7.3 Semantic Cache API](#73-semantic-cache-api)
  - [7.4 Loader API](#74-loader-api)
  - [7.5 Logger API](#75-logger-api)
- [8. Security Considerations](#8-security-considerations)
- [9. Monitoring & Logging](#9-monitoring--logging)
- [10. Troubleshooting](#10-troubleshooting)
- [11. Development Guide](#11-development-guide)
- [12. Maintenance & Operations](#12-maintenance--operations)

## 1. Overview

The MongoDB - Meta Quickstart enables users to upload documents, web content, and images, which are then processed, vectorized, and stored in MongoDB Atlas. The system utilizes a multi-agent architecture powered by Meta's Llama Large Language Models (LLMs) to provide contextually relevant responses to user queries by leveraging the stored information.

Key features include:
- Advanced vector search capabilities for nuanced, contextual information retrieval
- Seamless integration with AWS Bedrock for efficient AI model inference
- Highly intuitive chat interface for natural language querying and streamlined file uploads
- Scalable microservices architecture designed for optimal performance and resource utilization
- Robust data ingestion and processing pipeline capable of handling diverse data types
- Multi-modal file processing for comprehensive data analysis
- Real-time AI interactions for immediate insights and responses
- Stringent security measures to ensure the integrity and confidentiality of all data handled within the system
- Hybrid search capabilities combining vector and full-text search

This system empowers developers to create sophisticated AI applications that can understand context, process natural language queries, and provide intelligent responses based on ingested data. This makes it an ideal solution for a wide range of applications, from advanced customer support systems and intelligent document analysis tools to complex research assistants and innovative educational platforms.

## 2. System Architecture

![Meta App interactions](assets/meta/meta.png)

The MAAP architecture consists of several microservices that communicate with each other to process user queries and generate responses:

1. **UI Service**: Provides the web interface for user interaction (Port 7860)
2. **Main Service**: Orchestrates the multi-agent system and routes queries (Port 8000)
3. **AI Memory Service**: Manages conversation history and context (Port 8182)
4. **Semantic Cache Service**: Caches responses for similar queries (Port 8183)
5. **Loader Service**: Processes and ingests documents and web content (Port 8001)
6. **Logger Service**: Centralized logging for all components (Port 8181)
7. **MongoDB Atlas**: Provides vector search and storage capabilities (Ports 27015 to 27017 (TCP))

All services are containerized using Docker and can be deployed together using Docker Compose.

## 3. Components

### 3.1 UI Service

The UI Service provides a web-based interface for users to interact with the MAAP system. Built with Gradio and FastAPI, it offers:

- A chat interface for sending queries and receiving responses
- File upload capabilities for document ingestion
- Support for URL submission to extract web content
- User identification for personalized responses

Key files:
- `main.py`: Contains the FastAPI and Gradio application
- `images.py`: Manages image resources for the UI
- `logger.py`: Handles logging to the central logging service

### 3.2 Main Service

The Main Service is the core orchestrator of the MAAP system, managing the multi-agent architecture and routing queries to the appropriate specialized agents.

Components include:
- **Agent System**: A collection of specialized AI agents for different types of tasks
- **Query Router**: Routes queries to the appropriate agent(s) based on content analysis
- **Tools**: Utilities for searching MongoDB and external web sources
- **Semantic Cache**: Interface to the semantic caching service

Key files:
- `main.py`: Entry point for the service
- `agents.py`: Implementation of specialized AI agents
- `orchestrator.py`: Query routing and agent collaboration logic
- `tools.py`: Search and retrieval utilities
- `memory.py`: Interface to the AI Memory service
- `semantic_cache.py`: Interface to the Semantic Cache service

### 3.3 AI Memory Service

The AI Memory Service manages conversation history and provides contextual awareness to the system. It stores conversations in MongoDB with vector embeddings for semantic retrieval.

Features:
- Vector embeddings for semantic search of past conversations
- Hybrid search combining vector and text-based search
- Conversation summarization for context retrieval
- TTL (Time-To-Live) indexes for automatic data cleanup

Key files:
- `main.py`: FastAPI application implementing the memory service
- `logger.py`: Logging utilities

### 3.4 Semantic Cache Service

The Semantic Cache Service improves response times by storing and retrieving responses for semantically similar queries.

Features:
- Vector-based similarity matching for queries
- Configurable similarity threshold for cache hits
- TTL-based cache entry expiration

Key files:
- `main.py`: FastAPI application implementing the cache service
- `logger.py`: Logging utilities

### 3.5 Loader Service

The Loader Service handles the ingestion of documents, files, and web content into the system. It processes various file formats, extracts text, and creates vector embeddings for storage in MongoDB.

Features:
- Support for multiple file formats (PDF, DOCX, TXT, etc.)
- Web page content extraction
- Document chunking and vectorization
- MongoDB Atlas integration for vector storage

Key files:
- `main.py`: FastAPI application implementing the loader service
- `loader.py`: Document loading and processing logic
- `utils.py`: Utility functions for file handling and MongoDB integration
- `logger.py`: Logging utilities

### 3.6 Logger Service

The Logger Service provides centralized logging for all components of the MAAP system. It stores logs in MongoDB with TTL indexes for automatic cleanup.

Features:
- Buffered logging for performance
- File-based and MongoDB-based log storage
- Automatic log rotation and cleanup
- Structured logging with levels and timestamps

Key files:
- `main.py`: FastAPI application implementing the logging service

### 3.7 MongoDB Management Scripts

Several utility scripts are provided for managing MongoDB Atlas clusters and creating vector indexes:

- `mongodb_cluster_manager.ksh`: Manages MongoDB Atlas cluster deployment
- `mongodb_atlas_cli.py`: Python CLI for MongoDB Atlas operations
- `mongodb_create_vectorindex.ksh`: Creates vector indexes in MongoDB Atlas
- `mongodb_create_vectorindex.py`: Python implementation of vector index creation

## 4. Installation & Deployment

### Prerequisites
- AWS account with appropriate permissions
- MongoDB Atlas account with appropriate permissions
- Python 3.10+
- Docker and Docker Compose installed
- AWS CLI installed and configured
- EC2 quota for `t3.xlarge`
- Programmatic access to your MongoDB Atlas project

### MongoDB Atlas Programmatic Access
To enable programmatic access to your MongoDB Atlas project, follow these steps to create and manage API keys securely:


#### **1. Create an API Key**

1. **Navigate to Project Access Manager:**
   - In the Atlas UI, select your organization and project.
   - Go to **Project Access** under the **Access Manager** menu.

2. **Create API Key:**
   - Click on the **Applications** tab.
   - Select **API Keys**.
   - Click **Create API Key**.
   - Provide a description for the key.
   - Assign appropriate project permissions by selecting roles that align with the principle of least privilege.
   - Click **Next**.

3. **Save API Key Credentials:**
   - Copy and securely store the **Public Key** (username) and **Private Key** (password).
   - **Important:** The private key is displayed only once; ensure it's stored securely.



#### **2. Configure API Access List**

1. **Add Access List Entry:**
   - After creating the API key, add an IP address or CIDR block to the API access list to specify allowed sources for API requests.
   - Click **Add Access List Entry**.
   - Enter the IP address or click **Use Current IP Address** if accessing from the current host.
   - Click **Save**.

2. **Manage Access List:**
   - To modify the access list, navigate to the **API Keys** section.
   - Click the ellipsis (**...**) next to the API key and select **Edit Permissions**.
   - Update the access list as needed.



#### **3. Secure API Key Usage**

- **Environment Variables:** Store API keys in environment variables to prevent hardcoding them in your application's source code.

- **Access Controls:** Limit API key permissions to the minimum required for your application's functionality.

- **Regular Rotation:** Periodically rotate API keys and update your applications to use the new keys to enhance security.

- **Audit Logging:** Monitor API key usage through Atlas's auditing features to detect any unauthorized access.


By following these steps, you can securely grant programmatic access to your MongoDB Atlas project, ensuring that your API keys are managed and utilized in accordance with best practices.

For more detailed information, refer to [Guide](https://www.mongodb.com/docs/atlas/configure-api-access/#grant-programmatic-access-to-a-project).

---

### Minimum System Requirements
- Sufficient CPU and memory for running Docker containers
- Adequate network bandwidth for data transfer and API calls
- For EC2: At least a `t3.medium` instance (or higher, depending on workload)
- Sufficient EBS storage for EC2 instance (at least 100 GB recommended)
- MongoDB Atlas M10 Cluster (auto-deployed by the `one-click` script)



## 4.1 One-Click Deployment

The `one-click.ksh` Korn shell script automates the deployment of the MongoDB - Meta Quickstart application on AWS infrastructure. It sets up the necessary AWS resources, deploys an EC2 instance, and configures the application environment.

### Prerequisites

- AWS CLI installed and configured with appropriate credentials
- Access to a MongoDB Atlas account with necessary permissions
- Korn shell (ksh) environment

### Script Structure

The script is organized into several main functions:

1. `create_key()`: Creates or uses an existing EC2 key pair
2. `deploy_infra()`: Deploys the base infrastructure using CloudFormation
3. `deploy_ec2()`: Deploys the EC2 instance and application stack
4. `read_logs()`: Streams deployment logs from the EC2 instance
5. Main execution flow

### Configuration

#### Environment Variables

- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_SESSION_TOKEN`: AWS session token (if using temporary credentials)

#### Deployment Parameters

- `INFRA_STACK_NAME`: Name for the infrastructure CloudFormation stack
- `EC2_STACK_NAME`: Name for the EC2 CloudFormation stack
- `AWS_REGION`: AWS region for deployment
- `EC2_INSTANCE_TYPE`: EC2 instance type (e.g., "t3.xlarge")
- `VolumeSize`: EBS volume size in GB
- `GIT_REPO_URL`: URL of the application Git repository
- `MongoDBClusterName`: Name for the MongoDB Atlas cluster
- `MongoDBUserName`: MongoDB Atlas username
- `MongoDBPassword`: MongoDB Atlas password
- `APIPUBLICKEY`: MongoDB Atlas API public key
- `APIPRIVATEKEY`: MongoDB Atlas API private key
- `GROUPID`: MongoDB Atlas project ID
- `TAVILY_API_KEY`: Tavily Web Search API Key

#### Application Service Replicas

- `LoggerReplicas`: Number of Logger service replicas
- `LoaderReplicas`: Number of Loader service replicas
- `MainReplicas`: Number of Main service replicas
- `UIReplicas`: Number of UI service replicas
- `AIMemoryReplicas`: Number of AI Memory service replicas
- `SemanticCacheReplicas`: Number of Semantic Cache service replicas

### Execution Flow

1. Initialize logging
2. Create or use existing EC2 key pair
3. Deploy infrastructure CloudFormation stack
4. Retrieve and store infrastructure stack outputs
5. Deploy EC2 instance and application CloudFormation stack
6. Start streaming EC2 deployment logs
7. Monitor application URL until it becomes available
8. Launch application URL in default browser

### Functions

#### create_key()

Creates a new EC2 key pair or uses an existing one with the name "MAAPMetaKeyV1".

#### deploy_infra()

Deploys the base infrastructure CloudFormation stack, including VPC, subnet, security group, and IAM roles.

#### deploy_ec2()

Deploys the EC2 instance and application stack using a CloudFormation template. It includes the following steps:
- Selects the appropriate AMI ID based on the AWS region
- Creates the CloudFormation stack with necessary parameters
- Waits for stack creation to complete
- Retrieves and displays stack outputs

#### read_logs()

Establishes an SSH connection to the EC2 instance and streams the deployment logs in real-time.

### Logging

- Main deployment logs: `./logs/one-click-deployment.log`
- EC2 live logs: `./logs/ec2-live-logs.log`

### Error Handling

The script includes basic error checking for critical operations such as CloudFormation stack deployments. If an error occurs, the script will log the error and exit.

### Security Considerations

- AWS credentials are expected to be set as environment variables
- MongoDB Atlas credentials and API keys are passed as CloudFormation parameters

### Customization

To customize the deployment:
1. Modify the CloudFormation template files (`deploy-infra.yaml` and `deploy-ec2.yaml`)
2. Adjust the deployment parameters at the beginning of the script
3. Update the AMI IDs in the `ami_map` if newer AMIs are available

### Troubleshooting

- Check the log files for detailed information on the deployment process
- Ensure all required environment variables and parameters are correctly set
- Verify AWS CLI configuration and permissions
- Check CloudFormation stack events in the AWS Console for detailed error messages

### Limitations

- The script is designed for a specific application stack and may require modifications for other use cases
- It assumes a certain MongoDB Atlas and AWS account setup
- The script does not include rollback mechanisms for partial deployments. In case of partial failures, delete the related CloudFormation stacks from AWS Console.


### Deployment Steps

1. Clone the repository:
   ```
   git clone <repository-url>
   cd maap-meta-qs
   ```

2. Configure the `one-click.ksh` script:
   Open the script in a text editor and fill in the required values for various environment variables:
   - AWS Auth: Specify the `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` for deployment.
   - EC2 Instance Types: Choose suitable instance types for your workload.
   - Network Configuration: Update key names, subnet IDs, security group IDs, etc.
   - Authentication Keys: Fetch Project ID, API public and private keys for MongoDB Atlas Cluster setup. Update the script file with the keys for `APIPUBLICKEY`, `APIPRIVATEKEY`, `GROUPID` suitably.

3. Deploy the application:
   ```
   chmod +x one-click.ksh
   ./one-click.ksh
   ```

4. Access the application at `http://<ec2-instance-ip>:7860`

### Post-Deployment Verification
1. Access the UI service by navigating to `http://<ec2-instance-ip>:7860` in your web browser.
2. Test the system by entering a query and verifying that you receive an appropriate AI-generated response.
3. Try uploading a file to ensure the Loader Service is functioning correctly.
4. Verify that the sample dataset bundled with the script is loaded into your MongoDB Cluster name `MongoDBMetaV1` under the database `travel_agency` and collection `trip_recommendation` by visiting the [MongoDB Atlas Console](https://cloud.mongodb.com).


### 4.2 Manual Deployment

For manual deployment, follow these steps:

1. **Set up MongoDB Atlas Cluster**:
   ```bash
   ./mongodb_cluster_manager.ksh deploy <cluster_name> <username> <password>
   ```

2. **Create Vector Indexes**:
   ```bash
   ./mongodb_create_vectorindex.ksh
   ```

3. **Build Docker Images**:
   ```bash
   cd MAAP-AWS-Meta
   ./build-images.ksh
   ```

4. **Configure Environment Variables**:
   - Copy each service's sample.env to .env
   - Fill in the required environment variables (see Configuration section)

5. **Deploy with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

## 5. Configuration

### 5.1 Environment Variables

Each service requires specific environment variables for proper operation:

**Main Service**:
```
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
REFLECTION_AGENT="us.meta.llama3-3-70b-instruct-v1:0"
SOLUTION_AGENT="us.meta.llama3-2-11b-instruct-v1:0"
INQUIRY_AGENT="us.meta.llama3-1-8b-instruct-v1:0"
GUIDANCE_AGENT="us.meta.llama3-3-70b-instruct-v1:0"
VISUAL_AGENT="us.meta.llama3-2-90b-instruct-v1:0"
CODING_AGENT="us.meta.llama3-1-8b-instruct-v1:0"
ANALYTICS_AGENT="us.meta.llama3-3-70b-instruct-v1:0"
REASONING_AGENT="us.meta.llama3-2-3b-instruct-v1:0"
```

**Loader, AI Memory, Semantic Cache, and Logger Services**:
```
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority"
```

**Additional variables for specific services**:
- **Loader Service**: AWS credentials for Bedrock embeddings
- **AI Memory Service**: Model IDs for embedding and LLM
- **UI Service**: Connection strings for backend services

### 5.2 MongoDB Atlas Configuration

The system requires specific MongoDB Atlas configuration:

1. **Vector Search Indexes**:
   - Create vector indexes for document collections
   - Configure with appropriate dimension (1536) and similarity metric (cosine)

2. **Text Search Indexes**:
   - Create text search indexes for hybrid search capabilities

3. **TTL Indexes**:
   - Configure TTL indexes for automatic cleanup of logs and cache entries

Example vector index configuration:
```json
{
  "fields": [
    {
      "numDimensions": 1536,
      "path": "document_embedding",
      "similarity": "cosine",
      "type": "vector"
    },
    {
      "type": "filter",
      "path": "userId"
    }
  ]
}
```

Example text search index configuration:
```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "document_text": {
        "type": "string"
      }
    }
  }
}
```

## 6. Usage

### 6.1 User Interface

The MAAP UI is accessible via a web browser at `http://[server-ip]:7860`. The interface includes:

1. **User ID Field**: Enter a unique identifier to associate uploaded documents and conversation history
2. **Tools Selection**: Choose which search tools to use (MongoDB Hybrid Search, Web Search)
3. **Chat Interface**: Enter queries and view AI responses
4. **File Upload**: Attach documents to be processed and included in the knowledge base

### 6.2 Uploading Documents

To upload documents to the system:

1. Enter your User ID in the designated field
2. Click the attachment (clip) button in the chat input area
3. Select one or more files to upload
4. Optionally include a description or query about the uploaded content
5. Submit the query

Alternatively, you can paste URLs into the chat input to extract and process web content.

### 6.3 Querying the System

To query the system:

1. Enter your User ID to retrieve personalized content
2. Type your query in the chat input field
3. Select the desired tools (MongoDB Hybrid Search, Web Search)
4. Submit the query

The system will:
1. Check the semantic cache for similar previous queries
2. Retrieve relevant conversation history from AI Memory
3. Route the query to appropriate specialized agents
4. Generate a response based on the available information
5. Save the conversation to memory for future context

## 7. API Reference

### 7.1 Main Service API

**POST /agents**
- Description: Process user queries and route to appropriate agents
- Parameters:
  - `json_input_params` (Form): JSON string containing:
    - `message`: User message object with text and files
    - `history`: Conversation history
    - `userId`: User identifier
    - `conversation_id`: Unique conversation identifier
    - `tools`: List of tools to use
    - `query`: User query text
    - `images`: List of base64-encoded images
- Returns: Server-sent events with agent responses

### 7.2 AI Memory API

**POST /conversation/**
- Description: Add a message to the conversation memory
- Parameters:
  - Request body:
    - `user_id`: User identifier
    - `conversation_id`: Unique conversation identifier
    - `type`: Message type (human or ai)
    - `text`: Message text
    - `timestamp`: Optional UTC timestamp
- Returns: Success message

**GET /search/**
- Description: Search memory items by user_id and query
- Parameters:
  - `user_id`: User identifier
  - `query`: Search query text
- Returns: Matching documents

**GET /retrieve_memory/**
- Description: Retrieve memory items, context, and summary
- Parameters:
  - `user_id`: User identifier
  - `text`: Search query text
- Returns: Memory items, conversation context, and summary

### 7.3 Semantic Cache API

**POST /save_to_cache**
- Description: Save a query-response pair to cache
- Parameters:
  - Request body:
    - `user_id`: User identifier
    - `query`: Query text
    - `embedding`: Optional pre-computed embedding
    - `response`: Response text
- Returns: Success message

**POST /read_cache**
- Description: Retrieve a cached response for a query
- Parameters:
  - Request body:
    - `user_id`: User identifier
    - `query`: Query text
- Returns: Cached response if found

### 7.4 Loader API

**POST /upload**
- Description: Upload and process files and URLs
- Parameters:
  - `files`: List of files to upload
  - `json_input_params`: JSON string containing:
    - `userId`: User identifier
    - `MongoDB_URI`: MongoDB connection string
    - `MongoDB_text_key`: Field name for text storage
    - `MongoDB_embedding_key`: Field name for embedding storage
    - `MongoDB_index_name`: Vector index name
    - `MongoDB_database_name`: Database name
    - `MongoDB_collection_name`: Collection name
    - `WebPagesToIngest`: List of URLs to process
- Returns: Success message

### 7.5 Logger API

**POST /log**
- Description: Log a message
- Parameters:
  - Request body:
    - `level`: Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    - `message`: Log message text
    - `app_name`: Name of the application
- Returns: Success message


## 8. Security Considerations

To enhance the security of your AWS EC2 instances and MongoDB Atlas integration, consider the following configurations and best practices:



### Network and Firewall Configuration

#### **MongoDB Atlas:**
- **IP Access List:**
  - Restrict client connections to your Atlas clusters by configuring IP access lists.
  - Add the public IP addresses of your application environments to the IP access list to permit access.
  - For enhanced security, consider using VPC peering or private endpoints to allow private IP addresses.
  - [Configure IP Access List Entries](https://www.mongodb.com/docs/atlas/security/ip-access-list/).

- **Ports 27015 to 27017 (TCP):**
  - Ensure that your firewall allows outbound connections from your application environment to Atlas on ports **27015 to 27017** for TCP traffic.
  - This configuration enables your applications to access databases hosted on Atlas.

#### **AWS Services (e.g., Bedrock):**
- **Port 443 (HTTPS):**
  - Required for API calls and interactions.
  - Configure security groups to allow outbound traffic on port 443.
  - Ensure Network ACLs permit inbound and outbound traffic on this port.

---

### Authentication and Authorization

- **Database Users:**
  - Atlas mandates client authentication to access clusters.
  - Create database users with appropriate roles to control access.
  - [Configure Database Users](https://www.mongodb.com/docs/atlas/security/config-db-auth/).

- **Custom Roles:**
  - If default roles don't meet your requirements, define custom roles with specific privileges.
  - [Create Custom Roles](https://www.mongodb.com/docs/atlas/security/config-db-auth/#custom-database-roles).

- **AWS IAM Integration:**
  - Authenticate applications running on AWS services to Atlas clusters using AWS IAM roles.
  - Set up database users to use AWS IAM role ARNs for authentication.
  - [AWS IAM Authentication](https://www.mongodb.com/docs/atlas/security/config-db-auth/#authentication-with-aws-iam).

---

### Data Encryption

- **Encryption at Rest:**
  - Atlas encrypts all data stored on your clusters by default.
  - For enhanced security, consider using your own key management system.
  - [Encryption at Rest](https://www.mongodb.com/docs/atlas/security/encryption-at-rest/).

- **TLS/SSL Encryption:**
  - Atlas requires TLS encryption for client connections and intra-cluster communications.
  - Ensure your applications support TLS 1.2 or higher.
  - [TLS/SSL Configuration](https://www.mongodb.com/docs/atlas/security/tls-ssl/).

---

### Network Peering and Private Endpoints

- **VPC Peering:**
  - Establish VPC peering between your AWS VPC and MongoDB Atlas's VPC to eliminate public internet exposure.
  - [Set Up a Network Peering Connection](https://www.mongodb.com/docs/atlas/security/vpc-peering/).

- **Private Endpoints:**
  - Use AWS PrivateLink to create private endpoints for secure communication within AWS networks.
  - [Configure Private Endpoints](https://www.mongodb.com/docs/atlas/security-cluster-private-endpoint/).

- **NAT Gateway:**
  - Use NAT Gateways to route traffic from private subnets while preventing direct internet access to EC2 instances.  

- **Specific IP Ranges:**
  - AWS services like Bedrock use dynamic IPs. Filter these from [AWS IP Ranges](https://ip-ranges.amazonaws.com/ip-ranges.json) for egress traffic.  
---

### Compliance and Monitoring

- **Audit Logging:**
  - Enable audit logging to monitor database activities and ensure compliance with data protection regulations.
  - [Enable Audit Logging](https://www.mongodb.com/docs/atlas/security/audit-logging/).

- **Regular Updates:**
  - Keep your dependencies and Docker images up to date to address security vulnerabilities.

By implementing these configurations and best practices, you can enhance the security, efficiency, and compliance of your integration between AWS resources and MongoDB Atlas. 


## 9. Monitoring & Logging

The MAAP system includes a comprehensive logging solution:

1. **Centralized Logging**:
   - All services log to the Logger Service
   - Logs are stored in both files and MongoDB

2. **Log Levels**:
   - DEBUG: Detailed debugging information
   - INFO: General operational information
   - WARNING: Warning events
   - ERROR: Error events
   - CRITICAL: Critical events

3. **Log Retention**:
   - File logs are rotated daily and retained for 10 days
   - MongoDB logs have a TTL index for automatic cleanup

4. **Monitoring**:
   - Service health can be monitored via the Logger Service
   - MongoDB Atlas provides monitoring for database operations

To access logs:
- View log files in the `logs` directory of each service
- Query the `event_logs.logs` collection in MongoDB

## 10. Troubleshooting

Common issues and solutions:

1. **Connection Issues**:
   - **Problem**: Services cannot connect to MongoDB
   - **Solution**: Verify MongoDB URI, network connectivity, and whitelist IP addresses

2. **Vector Index Errors**:
   - **Problem**: Vector search fails
   - **Solution**: Run `mongodb_create_vectorindex.ksh` to recreate indexes

3. **AWS Bedrock Access**:
   - **Problem**: Cannot access AWS Bedrock models
   - **Solution**: Check AWS credentials and region configuration

4. **Docker Compose Issues**:
   - **Problem**: Services fail to start
   - **Solution**: Check logs with `docker-compose logs` and ensure environment variables are set

5. **Memory Issues**:
   - **Problem**: Services crash with out-of-memory errors
   - **Solution**: Increase container memory limits in docker-compose.yml

6. **Slow Response Times**:
   - **Problem**: System responses are slow
   - **Solution**: Increase service replicas, check MongoDB performance, optimize vector indexes

## 11. Development Guide

### Directory Structure

```
maap-meta-qs/
├── mongodb_cluster_manager.ksh
├── one-click.ksh
├── mongodb_atlas_cli.py
├── mongodb_create_vectorindex.ksh
├── mongodb_create_vectorindex.py
├── MAAP-AWS-Meta/
    ├── build-images.ksh
    ├── docker-compose.yml
    ├── ui/
    ├── main/
    ├── ai-memory/
    ├── semantic-cache/
    ├── loader/
    ├── logger/
    └── nginx/
```

### Development Workflow

1. **Setup Development Environment**:
   - Clone the repository
   - Install Docker and Docker Compose
   - Configure AWS credentials
   - Set up a MongoDB Atlas development cluster

2. **Local Development**:
   - Make changes to service code
   - Build the affected service: `docker build -t <service-name> .`
   - Update docker-compose.yml if needed
   - Restart services: `docker-compose up -d`

3. **Testing**:
   - Test individual services using their APIs
   - Test the full system through the UI
   - Check logs for errors: `docker-compose logs <service-name>`

4. **Adding New Agents**:
   - Create a new agent class in `agents.py` extending `AgentBase`
   - Implement the `respond()` method
   - Add the agent to the `MultiAgentSystem` class
   - Update environment variables with the model ID

5. **Adding New Tools**:
   - Add new methods to the `Tools` class in `tools.py`
   - Update the agent classes to use the new tools

## 12. Maintenance & Operations

### Regular Maintenance Tasks

1. **Database Management**:
   - Monitor MongoDB Atlas metrics for performance issues
   - Review and optimize indexes periodically
   - Set up alerts for storage capacity

2. **Log Rotation**:
   - Verify log rotation is working correctly
   - Adjust TTL settings if logs grow too large

3. **Security Updates**:
   - Regularly update Docker images
   - Apply security patches to dependencies
   - Rotate AWS and MongoDB credentials

4. **Scaling**:
   - Monitor resource usage and scale services as needed
   - Adjust replica counts in docker-compose.yml
   - Consider MongoDB Atlas tier upgrades for larger datasets

### Backup and Recovery

1. **MongoDB Backups**:
   - MongoDB Atlas provides automated backups
   - Configure backup schedule in Atlas console
   - Test restoration process periodically

2. **Configuration Backup**:
   - Back up environment files
   - Document any custom configurations
   - Store backup copies securely

3. **Disaster Recovery**:
   - Document recovery procedures
   - Test recovery process periodically
   - Maintain deployment scripts for quick rebuilding

### Performance Optimization

1. **MongoDB Performance**:
   - Use appropriate Atlas tier for workload
   - Monitor and optimize indexes
   - Configure read/write concerns appropriately

2. **Service Scaling**:
   - Adjust service replicas based on load
   - Monitor container resource usage
   - Consider horizontal scaling for high-traffic deployments

3. **Caching Strategy**:
   - Tune semantic cache thresholds
   - Adjust TTL settings for optimal cache hit rates
   - Monitor cache effectiveness and adjust as needed