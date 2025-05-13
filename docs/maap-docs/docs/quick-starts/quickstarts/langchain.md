# Langchain

## Introduction to MongoDB Atlas with LangChain

MongoDB Atlas provides a powerful foundation for building AI-powered applications when combined with LangChain. This integration enables developers to create sophisticated retrieval-augmented generation (RAG) systems, conversational AI applications, and knowledge-based agents with persistent memory.

### LangChain + MongoDB Atlas

LangChain is an open-source framework designed to simplify the development of applications using large language models (LLMs). When integrated with MongoDB Atlas, it offers:

- **Vector Search Capabilities**: Store embeddings in MongoDB Atlas vector collections for semantic search
- **Conversational Memory**: Persist chat history and context across sessions
- **Document Management**: Store, chunk, and retrieve documents for RAG applications
- **Structured Data Operations**: Leverage MongoDB's document model for complex data storage and retrieval

### Building Advanced AI Applications

With this integration, you can build various applications:

#### With LangChain
- **RAG Systems**: Create intelligent search systems that retrieve relevant documents and generate contextual responses
- **Knowledge Bases**: Build Q&A systems that reference your proprietary data
- **Virtual Assistants**: Develop domain-specific assistants with enhanced knowledge from your MongoDB data

#### With LangGraph
- **Multi-step Reasoning Workflows**: Create complex, stateful AI agents with persistent memory
- **Human-in-the-loop Systems**: Build applications with structured human feedback loops
- **Agentic Applications**: Develop AI systems that can plan and execute multi-step tasks

#### With LangGraph Swarm
- **Multi-agent Systems**: Create collaborative agent swarms that work together to solve complex problems
- **Consensus-based Decision Making**: Build systems where multiple agents debate and refine solutions
- **Specialized Agent Networks**: Deploy networks of agents with different expertise working in coordination

All these applications benefit from MongoDB Atlas's scalability, reliability, and comprehensive data management capabilities, creating a robust foundation for production-grade AI systems.

[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=mongodb-partners&repo=langchain-qs)](https://github.com/mongodb-partners/langchain-qs)

## Key MongoDB-LangChain Integration Components

### MongoDB Vector Store
- **Vector Search**: Leverage MongoDB Atlas Vector Search for semantic similarity queries
- **Document Retrieval**: Retrieve context-relevant documents for LLM prompting
- **Hybrid Search**: Combine keyword and semantic search capabilities

### MongoDB Checkpoint Saver
- **Persistence**: Store agent state and execution graphs in MongoDB
- **Session Management**: Maintain user context across interactions
- **Workflow Recovery**: Resume complex workflows from saved checkpoints

### MongoDB-Based Tools
- **Data Augmentation**: Enrich responses with structured MongoDB data
- **Dynamic Query Generation**: Generate optimized MongoDB queries based on user intent
- **Result Caching**: Cache frequent queries for improved performance

## Table of Contents
- [1. Overview](#1-overview)
- [2. System Architecture](#2-system-architecture)
- [3. Components](#3-components)
   - [3.1 UI Service](#31-ui-service)
   - [3.2 MongoDB Integration](#32-mongodb-integration)
- [4. Installation & Deployment](#4-installation--deployment)
   - [4.1 One-Click Deployment](#41-one-click-deployment)
- [5. Configuration](#5-configuration)
   - [5.1 Environment Variables](#51-environment-variables)
- [6. Usage](#6-usage)
   - [6.1 User Interface](#61-user-interface)
   - [6.2 Querying the System](#62-querying-the-system)
- [7. Security Considerations](#7-security-considerations)
- [8. Monitoring & Logging](#8-monitoring--logging)
- [9. Troubleshooting](#9-troubleshooting)
- [10. Maintenance & Operations](#10-maintenance--operations)

## 1. Overview

This solution demonstrates how to leverage semantic search on data stored in MongoDB Atlas and create a multi-agent RAG system using LangChain and LangGraph. The integration enables retrieval-augmented generation with various LLM providers, enhanced by MongoDB's vector capabilities for semantic search.

Use Case: Create an intelligent agent-based system that can search, retrieve, and generate responses using both proprietary data and web information.

## 2. System Architecture

![Architecture Diagram](https://raw.githubusercontent.com/mongodb-partners/langchain-qs/5f93dc0ab663b36d2346441e7521452883ee1eab/app/static/agents_nodes_graph.png)

The architecture consists of several integrated components:

1. **UI Service**: Streamlit-based web interface for user interaction (Port 8501)
2. **Multi-Agent Graph**: LangGraph-based orchestration of specialized agents
3. **MongoDB Atlas**: Powers vector search and checkpoint storage (Ports 27015-27017)
4. **LLM Integration**: Connects with providers like Fireworks AI and AWS Bedrock

All components work together in a graph-based workflow managed by LangGraph Swarm.

The provided code defines a function `initialize_swarm_graph` that sets up a multi-agent system for handling tasks like question answering. This system consists of three agents: *Eve, Bob, and George*. Each agent has specific responsibilities and tools to collaborate effectively. Here's a detailed explanation of the code:

1. Purpose of the Function
The `initialize_swarm_graph` function is designed to create a multi-agent workflow (referred to as a "swarm") where agents work together to process user queries, retrieve information, and generate responses. The function returns a compiled workflow that can be executed to handle these tasks.

2. Agents in the Swarm
The system consists of three agents, each with distinct roles:

   #### Eve
   Role: Eve is the planner and task executor.
   Responsibilities:
   Plan the actions required to answer the user's query.
   Delegate tasks to other agents when necessary.
   Tools:
   A handoff tool to call Bob for information that Eve does not have.
   Behavior:
   Eve does not fabricate answers and relies on tools to fetch relevant information.
   Eve is the default active agent in the workflow, meaning it initiates the process.
   #### Bob
   *Role:* Bob is the information retriever and question refiner.
   *Responsibilities:*
   Search for information using web tools.
   Rewrite questions to make them more specific.
   Collaborate with George to generate final responses.
   *Tools:*
   A web search tool to find information from the internet.
   A rewrite tool to refine questions.
   A grader tool to work with George for generating final responses.
   *Behavior:*
   Bob uses the tools to find information not available in private knowledge bases.
   #### George
   *Role:* George is the final response generator.
   *Responsibilities:*
   Generate the final response to the user's query.
   Use private knowledge bases to provide accurate answers.
   *Tools:*
   A final response tool to generate responses based on private knowledge
   *Behavior:*
   George ensures that the final response is accurate and concise.
3. MongoDB Integration
The function connects to a MongoDB database for checkpointing purposes. This allows the system to save and retrieve intermediate states of the workflow.
Details:
The MongoDB URI is fetched from an environment variable (MONGODB_URI).
The database name is test_ckp_2, and the collection name is test_ckpt_2.
The MongoDB client is used to interact with the database.
4. Workflow Creation
The function uses the create_swarm method to combine the three agents (Eve, Bob, and George) into a single workflow.
Default Active Agent: Eve is set as the default active agent, meaning it starts the workflow and delegates tasks as needed.
5. Workflow Compilation
The workflow is compiled using a checkpointing mechanism (memory_saver), which ensures that the system can save and restore its state during execution.
The compiled workflow is stored in the variable app.
6. Return Value
The function returns the compiled workflow (app), which can be used to execute the multi-agent system. This workflow allows the agents to collaborate and handle tasks like answering user queries.
#### Summary
The `initialize_swarm_graph` function sets up a multi-agent system with three agents (Eve, Bob, and George) that work together to process user queries. Each agent has specific tools and responsibilities:

Eve plans and delegates tasks.
Bob retrieves information and refines questions.
George generates the final response.
The system uses MongoDB for checkpointing and compiles the agents into a workflow that can be executed. This modular and collaborative approach ensures efficient handling of complex tasks.

## 3. Components

### 3.1 UI Service

The UI Service provides a web-based interface built with Streamlit, offering:

- Chat interface for query input and response display
- File upload for document processing
- Tool selection for search capabilities
- Model selection for different LLMs

Key files:
- `app/app.py`: Main Streamlit application
- `app/swarm/graph.py`: Agent workflow orchestration

### 3.2 MongoDB Integration

MongoDB Atlas provides several key capabilities for the system:

- **Vector Search**: Powers semantic retrieval with MongoDBAtlasVectorSearch
- **Checkpoint Storage**: Manages agent state with MongoDBSaver
- **Document Management**: Stores and retrieves chunked documents

Key files:
- `app/swarm/utils.py`: MongoDB connection and vector store setup
- `app/swarm/tools.py`: Tools for search and information retrieval


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

The `one-click.ksh` Korn shell script automates the deployment of the MongoDB - Cohere Quickstart application on AWS infrastructure. It sets up the necessary AWS resources, deploys an EC2 instance, and configures the application environment.

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

Creates a new EC2 key pair or uses an existing one with the name "MAAPCohereKeyV1".

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
   cd langchain-qs
   ```
2. Deploy Locally
   ```
   make all
   ```
3. Deploy on AWS
   Configure the `one-click.ksh` script:
   Open the script in a text editor and fill in the required values for various environment variables:
   - AWS Auth: Specify the `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` for deployment.
   - EC2 Instance Types: Choose suitable instance types for your workload.
   - Network Configuration: Update key names, subnet IDs, security group IDs, etc.
   - Authentication Keys: Fetch Project ID, API public and private keys for MongoDB Atlas Cluster setup. Update the script file with the keys for `APIPUBLICKEY`, `APIPRIVATEKEY`, `GROUPID` suitably.

   Deploy the application:
   ```
   chmod +x one-click.ksh
   ./one-click.ksh
   ```
4. Access the application at locally: `http://localhost:8501` or aws: `http://<ec2-instance-ip>:8501`

### Post-Deployment Verification
1. Access the UI service by navigating to `http://<ec2-instance-ip>:8501` in your web browser.
2. Test the system by entering a query and verifying that you receive an appropriate AI-generated response.
4. Verify that the sample dataset bundled with the script is loaded into your MongoDB Cluster name `MongoDBCohereV1` under the database `asset_management_use_case` and collection `market_reports` by visiting the [MongoDB Atlas Console](https://cloud.mongodb.com).

## 5. Configuration

### 5.1 Environment Variables

Each service requires specific environment variables for proper operation:

**Main Service**:
```
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
FIREWORKS_API_KEY="xxxxxxxx"
```

## 6. Usage

### 6.1 User Interface

The MAAP UI is accessible via a web browser at `http://[server-ip]:8501`. The interface includes:
### Viewing Agent Responses
1. Enter a query or prompt in the chat input box.
2. Select a desired tool or model if multiple options are available.
3. Press "Submit" to see the AI-generated response. Use the conversation history to maintain context.
4. For file-driven tasks, upload your document and let the agent process relevant chunks to craft contextual replies.
5. Monitor agent outputs and iterate as needed to refine or adjust your queries.


### 6.2 How the Graph Works

LangGraph composes multiple specialized agents that collaborate in a swarm-like architecture. Each agent can hand off tasks or results to others, ensuring the right tool or approach is used. This orchestration maximizes accuracy and efficiency, producing more comprehensive and context-aware responses.



