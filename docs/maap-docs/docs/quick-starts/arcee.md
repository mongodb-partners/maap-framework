#  MongoDB - Arcee Quickstart

MongoDB - Arcee Quickstart is a project aimed at facilitating the rapid and straightforward deployment of AI-driven applications utilizing MongoDB Atlas and Arcee models. It offers scripts and configurations to streamline and automate the setup process, integrating MongoDB Atlas for data storage and Arcee models for AI functionalities.

## Table of Contents
1. [Overview](#1-overview)
2. [System Architecture](#2-system-architecture)
3. [Components](#3-components)
4. [Installation & Deployment](#4-installation--deployment)
5. [Configuration](#5-configuration)
6. [Usage](#6-usage)
7. [API Reference](#7-api-reference)
8. [Security Considerations](#8-security-considerations)
9. [Monitoring & Logging](#9-monitoring--logging)
10. [Troubleshooting](#10-troubleshooting)
11. [Development Guide](#11-development-guide)
12. [Maintenance & Operations](#12-maintenance--operations)

## 1. Overview

The MongoDB - Arcee Quickstart is a comprehensive, integrated end-to-end technology stack meticulously designed to facilitate the rapid development and seamless deployment of AI-powered applications. This innovative framework combines the robust capabilities of MongoDB Atlas for scalable data storage and advanced vector search functionalities with the powerful machine learning capabilities of AWS SageMaker and Arcee.ai's state-of-the-art language models. The entire system is encapsulated within a user-friendly interface, enabling effortless interaction and management.

Key features include:
- Advanced vector search capabilities for nuanced, contextual information retrieval
- Seamless integration with AWS SageMaker for efficient AI model inference
- Highly intuitive chat interface for natural language querying and streamlined file uploads
- Scalable microservices architecture designed for optimal performance and resource utilization
- Robust data ingestion and processing pipeline capable of handling diverse data types
- Multi-modal file processing for comprehensive data analysis
- Real-time AI interactions for immediate insights and responses
- Stringent security measures to ensure the integrity and confidentiality of all data handled within the system

MAAP empowers developers to create sophisticated AI applications that can understand context, process natural language queries, and provide intelligent responses based on ingested data. This makes it an ideal solution for a wide range of applications, from advanced customer support systems and intelligent document analysis tools to complex research assistants and innovative educational platforms.

## 2. System Architecture

The MAAP Framework is built on a robust and flexible microservices architecture, comprising three primary services that work in concert to deliver a seamless AI-powered application experience:

1. **UI Service (Port 7860)**: This service forms the front-end of the MAAP framework, providing an intuitive and responsive user interface for interaction. It serves as the primary point of contact for end-users, allowing them to input queries, upload files, and view AI-generated responses.

2. **Main Service (Port 8000)**: Acting as the brain of the system, the Main Service handles the core application logic, manages database queries, and orchestrates AI model interactions. It processes user inputs received from the UI Service, retrieves relevant information from the database, and coordinates with AWS SageMaker for AI model inferences.

3. **Loader Service (Port 8001)**: This service is responsible for managing file uploads and orchestrating the data ingestion process. It handles the complex task of processing various file formats, extracting relevant information, and preparing the data for storage in MongoDB Atlas.

These microservices interact seamlessly with MongoDB Atlas, which serves as the primary data store and provides powerful vector search capabilities. The architecture also integrates with AWS SageMaker, leveraging its scalable infrastructure for AI model hosting and inference.

![MAAP Application Architecture](ArceeAWSArchitecture.png)

Data flow within the system:
1. User inputs (text queries or file uploads) are initially received by the UI Service.
2. For document processing, the Loader Service takes over, utilizing AWS Bedrock and the Titan Embeddings model to generate vector representations of the content.
3. These vector embeddings are then stored in MongoDB Atlas, enabling fast and accurate similarity searches.
4. When a query is processed, the Main Service coordinates the retrieval of relevant information from MongoDB Atlas and the generation of appropriate responses.
5. For more complex language understanding and generation tasks, the Main Service interacts with the AI models hosted on AWS SageMaker, specifically leveraging Arcee.ai's advanced language models.

This architecture ensures high scalability, allowing the system to handle increasing loads by scaling individual components as needed. It also provides flexibility, enabling easy updates or replacements of specific services without affecting the entire system.

## 3. Components

The MAAP Framework is composed of several key components:

### UI Service
- **Purpose**: Provides a web-based interface for user interactions
- **Technologies**: Gradio, Python
- **Interactions**: Communicates with Main Service for query processing and Loader Service for file uploads

### Main Service
- **Purpose**: Handles core application logic, database queries, and AI model interactions
- **Technologies**: FastAPI, LangChain, Python
- **Interactions**: Communicates with MongoDB Atlas for data retrieval and AWS SageMaker for model inference

### Loader Service
- **Purpose**: Manages file uploads and data ingestion into MongoDB Atlas
- **Technologies**: FastAPI, Unstructured, Python
- **Interactions**: Communicates with MongoDB Atlas for data storage

### MongoDB Atlas
- **Purpose**: Provides scalable data storage and vector search capabilities
- **Features**: Vector indexing, multi-collection search

### AWS SageMaker
- **Purpose**: Hosts and serves AI models for inference
- **Features**: Scalable model deployment, API endpoints for prediction

### Core Components
1. **CloudFormation Templates**:
   - `deploy-infra.yaml`: Infrastructure setup
   - `deploy-sagemaker.yaml`: SageMaker deployment
   - `deploy-ec2.yaml`: EC2 instance configuration

2. **Python Services**:
   - MongoDB Atlas integration
   - Vector search implementation
   - Document processing
   - API endpoints

3. **Docker Containers**:
   - Isolated service environments
   - Dependency management
   - Resource allocation

### Technology Stack
- **Backend**: Python 3.10+
- **Database**: MongoDB Atlas
- **ML Platform**: AWS SageMaker
- **API Framework**: FastAPI
- **Frontend**: Gradio
- **Containerization**: Docker
- **Infrastructure**: AWS CloudFormation

## 4. Installation & Deployment

### Prerequisites
- AWS account with appropriate permissions
- MongoDB Atlas account with appropriate permissions
- Python 3.10+
- AWS CLI installed and configured
- SageMaker quota for `ml.g5.12xlarge`
- EC2 quota for `t3.xlarge`

### Minimum System Requirements
- For SageMaker: At least one `ml.g5.12xlarge` instance (or equivalent GPU instance)
- For EC2: At least a `t3.medium` instance (or higher, depending on workload)
- Sufficient EBS storage for EC2 instance (at least 100 GB recommended)

### Deployment Steps

1. **Configure AWS CLI**:
```bash
aws configure
```

2. **Obtain the deployment files**:

   a. Clone the repository:
   ```bash
   git clone <repository-url>
   cd MAAP-Framework
   ```
   
   b. Or download the following files from the GitHub repository:
   - `deploy-infra.yaml`
   - `deploy-sagemaker.yaml`
   - `deploy-ec2.yaml`
   - `one-click.ksh`

3. **Configure environment variables**:
   Open the `one-click.ksh` script in a text editor and fill in the required values for various environment variables:
   - AWS Auth: Specify the `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` for deployment.
   - EC2 & SageMaker Instance Types: Choose suitable instance types for your workload.
   - Network Configuration: Update key names, subnet IDs, security group IDs, etc.
   - Authentication Keys: Fetch Project ID, API public and private keys for MongoDB Atlas Cluster setup. Update the script file with the keys for `APIPUBLICKEY`, `APIPRIVATEKEY`, `GROUPID` suitably.

4. **Deploy the application**:
```bash
chmod +x one-click.ksh
./one-click.ksh
```

This script will create the necessary AWS resources, deploy the SageMaker endpoint, set up and configure the EC2 instance, and install and start the MAAP services.

### Post-Deployment Verification
1. Access the UI service by navigating to `http://<ec2-instance-ip>:7860` in your web browser.
2. Test the system by entering a query and verifying that you receive an appropriate AI-generated response.
3. Try uploading a file to ensure the Loader Service is functioning correctly.
4. Verify that the sample dataset bundled with the script is loaded into your MongoDB Cluster name `MongoDBArceeV1` under the database `travel_agency` and collection `trip_recommendation` by visiting the [MongoDB Atlas Console](https://cloud.mongodb.com).

## 5. Configuration

Key configuration files:
- `.env` files in each service directory
- `docker-compose.yml` for service orchestration
- CloudFormation templates for AWS resource configuration

Important settings:
- MongoDB URI
- AWS credentials and region
- SageMaker endpoint name
- API keys for external services

Note: The `one-click.ksh` script automates the process of setting these values in the appropriate `.env` files.

### Environment Variables
The deployment script creates a `.env` file on the EC2 instance with the following structure:

```env
MONGODB_URI=your_mongodb_connection_string
SAGEMAKER_ENDPOINT_NAME=your_endpoint_name
AWS_REGION=your_aws_region
API_PUBLIC_KEY=your_api_key
API_PRIVATE_KEY=your_private_key
GROUP_ID=your_project_id
```

### Service-Specific Configuration

1. **Main Service**:
   - Model parameters can be adjusted in the `SageMakerLLM.py` file.
   - Vector search settings are configured in `MongoDBAtlasCustomRetriever.py`.

2. **Loader Service**:
   - File processing settings are defined in `loader.py`.
   - Upload configurations are set in `main.py`.

3. **UI Service**:
   - The interface layout and components are configured in `main.py` using Gradio's UI building functions.

### MongoDB Vector Indexes
Ensure that your MongoDB Atlas collection has the appropriate vector index configured:

```javascript
{
  "fields": [
    {
      "numDimensions": 1536,
      "path": "details_embedding",
      "similarity": "cosine",
      "type": "vector"
    }
  ]
}
```

## 6. Usage

1. Access the UI at `http://<ec2-instance-ip>:7860`
2. Enter a user ID and select data sources
3. Type queries or upload files for processing
4. View AI-generated responses based on the context

Example query and response:

```
User: Recommend places to visit in India.
AI: Here are some popular places to visit in India:

1. Taj Mahal, Agra: One of the Seven Wonders of the World, this iconic marble mausoleum is a must-visit.

2. Jaipur, Rajasthan: Known as the "Pink City," it features beautiful palaces and forts like Amber Fort and Hawa Mahal.

3. Varanasi: One of the oldest inhabited cities in the world, known for its spiritual significance and Ganges River ghats.

4. Kerala Backwaters: Enjoy a houseboat cruise through the serene backwaters of Kerala.

5. Goa: Famous for its beaches, Portuguese architecture, and vibrant nightlife.

6. Rishikesh: A spiritual center known for yoga and meditation, located in the foothills of the Himalayas.

7. Udaipur: The "City of Lakes" is known for its romantic setting and beautiful palaces.

8. Delhi: The capital city offers a mix of historical sites like Red Fort and Qutub Minar, as well as modern attractions.

9. Mumbai: India's largest city, known for its bustling urban life, Bollywood, and historical sites like the Gateway of India.

10. Hampi: An ancient village with fascinating ruins of the Vijayanagara Empire.

These destinations offer a diverse range of experiences, from historical and cultural sites to natural beauty and spiritual retreats. Remember to check travel advisories and plan your trip according to the best seasons to visit each location.
```

## 7. API Reference

### Main Service Endpoints
- `/rag`: POST request for RAG (Retrieval-Augmented Generation) queries

### Loader Service Endpoints
- `/upload`: POST request for file uploads and data ingestion

### UI Service
```python
Gradio Interface
URL: http://{EC2PublicIP}:7860
```

### Example Usage
```python
# Query example
curl -X POST "http://localhost:8000/rag" -H "Content-Type: application/json" -d '{"query": "Tell me about India", "userId": "user123"}'
```

## 8. Security Considerations

- Use secure communication (HTTPS) for all services in production deployments
- Implement proper authentication and authorization
- Follow AWS and MongoDB Atlas security best practices
- Encrypt sensitive data at rest and in transit

### Authentication & Authorization
- MongoDB Atlas authentication
- AWS IAM roles
- API key management

### Data Security
- Encryption at rest
- Secure file handling
- Network security groups

### Compliance
- Data privacy regulations
- Access control policies
- Audit logging

## 9. Monitoring & Logging

- Use AWS CloudWatch for EC2 and SageMaker monitoring
- MongoDB Atlas provides built-in monitoring for database operations
- Application deployment logs are stored in `/home/ubuntu/deployment.log` on the EC2 instance
- Implement centralized logging for all microservices
- The loader service has logs in the `applogs` folder
- Consider logging to MongoDB

### Log Locations
- Application logs: `/home/ubuntu/deployment.log`
- One-click script logs: `./logs/one-click-deployment.log`
- EC2 live logs: `./logs/ec2-live-logs.log`
- Docker logs: Accessible via `docker logs`

### Monitoring Metrics
- CPU/Memory usage
- API response times
- Vector search performance
- Model inference latency

## 10. Troubleshooting

Common issues and solutions:
- Connection errors: Check network configurations and security groups
- Slow responses: Monitor resource utilization and scale as needed
- Data ingestion failures: Verify file formats and MongoDB Atlas connection

### Debug Steps
1. Check logs
2. Verify credentials
3. Confirm resource availability
4. Test network connectivity

## 11. Development Guide

### Code Organization
```
MAAP-Python/
├── main/
│   ├── app/
│   │   ├── server.py
│   │   └── requirements.txt
│   └── Dockerfile
├── loader/
│   ├── main.py
│   └── Dockerfile
├── ui/
│   ├── main.py
│   └── Dockerfile
└── docker-compose.yml
```

### Development Environment
- Use Docker for local development and testing

### Testing Procedures
1. Unit tests for each service
2. Integration tests for API endpoints
3. End-to-end testing with sample data

## 12. Maintenance & Operations

- Regularly update dependencies and runtime environments
- Monitor system performance and scale resources as needed
- Implement backup and disaster recovery procedures for MongoDB Atlas
- Conduct security audits and penetration testing periodically

### Monitoring
- CloudWatch metrics
- MongoDB Atlas monitoring
- Application logs

### Backup Procedures
- MongoDB Atlas backups
- Configuration backups
- Docker image versioning

### Support and Maintenance
For support:
- Slack @ #ask-maap