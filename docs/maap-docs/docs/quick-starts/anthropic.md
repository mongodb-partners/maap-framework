# MongoDB - Anthropic Quickstart

MongoDB - Anthropic Quickstart is an integrated end-to-end technology stack that combines MongoDB Atlas capabilities with Anthropic's Claude AI models to create an intelligent Agentic conversational interface. It allows users to interact with MongoDB data sources through natural language queries, leveraging vector search, full-text search, hybrid search and other advanced querying techniques.

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

The MongoDB - Anthropic Quickstart is a comprehensive, integrated end-to-end technology stack meticulously designed to facilitate the rapid development and seamless deployment of AI-powered Agentic applications. This innovative framework combines the robust capabilities of MongoDB Atlas for scalable data storage and advanced vector search functionalities with Anthropic's Claude AI state-of-the-art language models for powerful natural language processing and generation.

Key features include:
- Advanced vector search capabilities for nuanced, contextual information retrieval
- Seamless integration with AWS Bedrock for efficient AI model inference
- Highly intuitive chat interface for natural language querying and streamlined file uploads
- Scalable microservices architecture designed for optimal performance and resource utilization
- Robust data ingestion and processing pipeline capable of handling diverse data types
- Multi-modal file processing for comprehensive data analysis
- Real-time AI interactions for immediate insights and responses
- Stringent security measures to ensure the integrity and confidentiality of all data handled within the system
- Long-term conversation memory for contextual responses
- Support for multiple file types including images, PDFs, and Word documents
- Hybrid search capabilities combining vector and full-text search

This system empowers developers to create sophisticated AI applications that can understand context, process natural language queries, and provide intelligent responses based on ingested data. This makes it an ideal solution for a wide range of applications, from advanced customer support systems and intelligent document analysis tools to complex research assistants and innovative educational platforms.

## 2. System Architecture

The system architecture consists of the following components:

1. **Frontend**: A Gradio-based web interface for user interactions.
2. **Backend Services**:
   - UI Service (Port 7860): Handles user interface and initial request processing.
   - Loader Service (Port 8001): Manages file uploads and data ingestion.
   - Main Service (Port 8000/8002): Orchestrates AI interactions and database queries.
3. **Databases**:
   - MongoDB Atlas: Stores document data, embeddings, and chat history.
4. **External Services**:
   - AWS Bedrock: Hosts the Anthropic Claude 3.5 Sonnet AI model.
   - AWS Titan Embeddings: Generates embeddings for vector search.

The system uses Docker for containerization and deployment.

![MAAP Application Architecture](assets/anthropic/AnthropicAWSArchitecture.png)

**Data flow within the system:**

Users interact with the Gradio-based frontend UI, which acts as the entry point for all inputs. 

- Text queries or file uploads from users are forwarded to the **UI Service**.  
- For file uploads, the **Loader Service** handles data ingestion and processes content using **AWS Titan Embeddings**, generating vector representations of the input data.  
- These vector embeddings are stored in **MongoDB Atlas**, enabling efficient vector or full-text similarity searches.  
- For text query processing, the **Main Service** coordinates multiple actions:
  - Retrieves relevant information from **MongoDB Atlas** using vector or full-text search.  
  - Handles AI-specific queries by interacting with **AWS Bedrock**, specifically leveraging **Claude AI** for language understanding and generation.  
  - Utilizes **AWS Titan Embeddings** for embedding generation when necessary.  

This system ensures a seamless user experience and leverages advanced AI models for robust query handling and content processing.

This architecture ensures high scalability, allowing the system to handle increasing loads by scaling individual components as needed. It also provides flexibility, enabling easy updates or replacements of specific services without affecting the entire system.

## 3. Components

This system is composed of several key components:

### UI Service
- **Purpose**: Provides a web-based interface for user interactions
- **Technologies**: Gradio, Python
- **Key Files**:
  - `ui/main.py`: Contains the Gradio interface definition
  - `ui/Dockerfile`: Defines the container for the UI service

### Main Service
- **Purpose**: Handles core application logic, database queries, and AI model interactions
- **Technologies**: FastAPI, LangChain, Python
- **Key Files**:
  - `main/app/server.py`: FastAPI application implementing the main service logic
  - `main/MongoDBAtlasRetrieverTools.py`: Custom tools for querying MongoDB
  - `main/Dockerfile`: Defines the container for the main service

### Loader Service
- **Purpose**: Manages file uploads and data ingestion into MongoDB Atlas
- **Technologies**: FastAPI, Unstructured, Python
- **Key Files**:
  - `loader/main.py`: FastAPI application for handling uploads
  - `loader/loader.py`: Functions for processing different types of data
  - `loader/Dockerfile`: Defines the container for the loader service

### MongoDB Atlas
- **Purpose**: Provides scalable data storage and vector search capabilities
- **Features**: Vector indexing, multi-collection search
- **Collections**:
  - Trip recommendations
  - User uploaded data
  - Chat history storage

### AWS Bedrock
- **Purpose**: Hosts and serves the Anthropic Claude 3.5 Sonnet AI model for inference
- **Features**: Scalable model deployment, API endpoints for prediction

### Core Components
1. **Docker Containers**:
   - Isolated service environments
   - Dependency management
   - Resource allocation

2. **CloudFormation Templates**:
   - `deploy-infra.yaml`: Infrastructure setup
   - `deploy-ec2.yaml`: EC2 instance configuration

### Technology Stack
- **Backend**: Python 3.10+
- **Database**: MongoDB Atlas
- **API Framework**: FastAPI
- **Frontend**: Gradio
- **Containerization**: Docker
- **Infrastructure**: AWS CloudFormation

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

### Deployment Steps

1. Clone the repository:
   ```
   git clone <repository-url>
   cd MAAP-Framework
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=<your-mongodb-atlas-uri>
   AWS_ACCESS_KEY_ID=<your-aws-access-key>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
   AWS_REGION=us-east-1
   ```

3. Configure the `one-click.ksh` script:
   Open the script in a text editor and fill in the required values for various environment variables:
   - AWS Auth: Specify the `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` for deployment.
   - EC2 Instance Types: Choose suitable instance types for your workload.
   - Network Configuration: Update key names, subnet IDs, security group IDs, etc.
   - Authentication Keys: Fetch Project ID, API public and private keys for MongoDB Atlas Cluster setup. Update the script file with the keys for `APIPUBLICKEY`, `APIPRIVATEKEY`, `GROUPID` suitably.

4. Deploy the application:
   ```
   chmod +x one-click.ksh
   ./one-click.ksh
   ```

5. Build the Docker images:
   ```
   ./build-images.ksh
   ```

6. Start the services using Docker Compose:
   ```
   docker-compose up -d
   ```

7. Access the application at `http://<ec2-instance-ip>:7860`

### Post-Deployment Verification
1. Access the UI service by navigating to `http://<ec2-instance-ip>:7860` in your web browser.
2. Test the system by entering a query and verifying that you receive an appropriate AI-generated response.
3. Try uploading a file to ensure the Loader Service is functioning correctly.
4. Verify that the sample dataset bundled with the script is loaded into your MongoDB Cluster name `MongoDBArceeV1` under the database `travel_agency` and collection `trip_recommendation` by visiting the [MongoDB Atlas Console](https://cloud.mongodb.com).

## 5. Configuration

### Environment Variables
- `MONGODB_URI`: Connection string for MongoDB Atlas
- `AWS_ACCESS_KEY_ID`: AWS access key for Bedrock and Titan Embeddings
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `AWS_REGION`: AWS region (default: us-east-1)
- `SAGEMAKER_ENDPOINT_NAME`: Your endpoint name
- `API_PUBLIC_KEY`: Your API key
- `API_PRIVATE_KEY`: Your private key
- `GROUP_ID`: Your project ID

### AI Model Configuration
The AI model can be configured in `main/Models.py`:

```python
class ModelId(str, Enum):
    CLAUDE_3_5_S = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    # ... other model options ...

class ModelKwargs(BaseModel):
    temperature: float = Field(default=0.5, ge=0, le=1)
    max_tokens: int = Field(default=2048, ge=1, le=4096)
    # ... other model parameters ...
```

### MongoDB Indexes
Ensure the following indexes are created in your MongoDB Atlas cluster:

1. Vector index on the `trip_recommendation` collection
2. Vector index on the `document` collection
3. Text index on the `document` collection
4. Text index on the `trip_recommendation` collection

Example vector index configuration:
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

### Service-Specific Configuration

1. **Main Service**:
   - Model parameters can be adjusted in the `main/Models.py` file.
   - Vector search settings are configured in `MongoDBAtlasCustomRetriever.py`.

2. **Loader Service**:
   - File processing settings are defined in `loader.py`.
   - Upload configurations are set in `main.py`.

3. **UI Service**:
   - The interface layout and components are configured in `main.py` using Gradio's UI building functions.

## 6. Usage

1. Open the application in a web browser at `http://<ec2-instance-ip>:7860`.
2. Enter a User ID in the provided input field.
3. Select the relevant MongoDB Atlas data sources and retrieval tools.
4. Type your query in the chat input or upload files for analysis.
5. The AI will process your query, use the appropriate tools to search MongoDB, and provide a response.

Example queries:
- "Recommend places to visit in India."
- "Analyze this image of a nutritional label."
- "Summarize the key points from this PDF about AI trends."
- "Review Amazon's quarterly results from this PDF."
- "Analyze this CetoAI-related Word document."

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

### UI Service API
The UI service exposes a Gradio interface and does not have a separate API.

### Loader Service API
- Endpoint: `/upload`
- Method: POST
- Parameters:
  - `files`: List of files to upload (multipart/form-data)
  - `json_input_params`: JSON string containing input parameters

### Main Service API
- Endpoint: `/rag`
- Method: POST
- Headers:
  - `Cookie`: `user_id=<user-id>`
- Request Body:
  ```json
  {
    "input": "Your query here",
    "chat_history": [],
    "tools": ["MongoDB Vector Search", "MongoDB FullText Search"]
  }
  ```

Example usage:
```python
# Query example
curl -X POST "http://localhost:8000/rag" -H "Content-Type: application/json" -d '{"query": "Tell me about India", "userId": "user123"}'
```


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

### Logging
- Each service logs request and response details for debugging and analytics.
- Deployment logs are stored in the `/logs` directory.
- Application deployment logs are stored in `/home/ubuntu/deployment.log` on the EC2 instance
- One-click script logs: `./logs/one-click-deployment.log`
- EC2 live logs: `./logs/ec2-live-logs.log`
- Docker logs: Accessible via `docker logs`
- The loader service has logs in the `applogs` folder

### Monitoring
- Use MongoDB Atlas monitoring tools to track database performance.
- Set up AWS CloudWatch for monitoring AI model interactions and AWS resource usage.
- Monitor key metrics:
  - CPU/Memory usage
  - API response times
  - Vector search performance
  - Model inference latency

### Alerts
- Configure alerts for unusual activity or high resource utilization in MongoDB Atlas and AWS.

## 10. Troubleshooting

### Common Issues
1. Application Fails to Start
2. AI Model Responses Are Incorrect
3. Database Connection Errors
4. File Uploads Fail
5. Slow Responses

### Debugging
- Use `docker logs <container_id>` to inspect logs for any specific container.

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