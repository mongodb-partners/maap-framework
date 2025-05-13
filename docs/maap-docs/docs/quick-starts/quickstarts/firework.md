# MongoDB - Firework Quickstart

## BFSI Credit Recommendation & Scoring Application

A modular, containerized full-stack solution for BFSI credit recommendation and scoring, featuring a Python/Flask backend, a React/Next.js frontend, and MongoDB for persistent storage.

The quick start demonstrates how alternative data, artificial intelligence (AI), and generative AI (Gen AI) are revolutionizing credit scoring and application processes. Traditional credit scoring models face several challenges, including limited credit history, inconsistent income, high credit utilization, and lack of transparency in rejection reasons. To overcome these issues, MongoDB's modern database solutions and AI-powered analytics offer a more inclusive, efficient, and personalized credit assessment approach.

### **Challenges with Traditional Credit Scoring**
Traditional credit scoring relies on historical financial data, often excluding individuals without established credit histories or stable income sources. High credit utilization can also negatively impact scoring, and many applicants receive vague rejection notices without understanding the reasons behind their declined applications.

### **Transforming Credit Applications with MongoDB and AI**
MongoDB enables more efficient credit application processing by supporting JSON-based document storage, eliminating redundant information collection, and improving data accuracy. AI-driven credit scoring models assess risk based on a broader range of financial behaviors, enhancing precision and inclusivity.

### **Enhancing Credit Scoring and Risk Profiling**
Using MongoDB's modern data platform, banks and financial institutions can create comprehensive user profiles, integrating information from multiple sources, including credit bureaus and open banking systems. AI models, such as XGBoost, analyze these datasets to predict delinquency risks and personalize credit offerings. MongoDB Atlas simplifies data transformation and retrieval, improving processing speed and efficiency.

### **Explaining Credit Application Declinations**
Generative AI, particularly large language models (LLMs), can provide detailed and transparent explanations for credit application rejections. By incorporating explainable AI techniques, banks can communicate the reasons for declination, allowing applicants to understand and improve their creditworthiness.

### **Alternative Product Recommendations**
Financial institutions can leverage Gen AI to recommend tailored credit products to applicants based on their risk profiles and financial behaviors. MongoDB Atlas Vector Search supports retrieval-augmented generation (RAG), enabling dynamic and personalized recommendations. This approach enhances customer engagement, improving the likelihood of product acceptance.

### **Key Considerations for AI-Powered Credit Scoring**
The adoption of AI-driven credit scoring models introduces new opportunities to address traditional scoring limitations, improve transparency, and integrate alternative data points, such as utility bills and certification histories. However, mitigating AI hallucination risks and maintaining factual accuracy through RAG techniques are crucial for reliable credit assessments.

[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=ashwin-gangadhar-mdb&repo=mdb-bfsi-credit-reco-genai)](https://github.com/ashwin-gangadhar-mdb/mdb-bfsi-credit-reco-genai)

## Demo Video

Watch a walkthrough of the MongoDB Credit Scoring Application:

[![Demo Video](https://img.youtube.com/vi/tUgSCnGjTI0/0.jpg)](https://youtu.be/tUgSCnGjTI0?t=1486)

## Table of Contents

- [BFSI Credit Recommendation & Scoring Application](#bfsi-credit-recommendation--scoring-application)
   - [Challenges with Traditional Credit Scoring](#challenges-with-traditional-credit-scoring)
   - [Transforming Credit Applications with MongoDB and AI](#transforming-credit-applications-with-mongodb-and-ai)
   - [Enhancing Credit Scoring and Risk Profiling](#enhancing-credit-scoring-and-risk-profiling)
   - [Explaining Credit Application Declinations](#explaining-credit-application-declinations)
   - [Alternative Product Recommendations](#alternative-product-recommendations)
   - [Key Considerations for AI-Powered Credit Scoring](#key-considerations-for-ai-powered-credit-scoring)
- [Demo Video](#demo-video)
- [Features](#features)
- [Architecture Overview](#architecture-overview)
   - [Components](#components)
   - [Backend](#backend)
   - [Frontend](#frontend)
   - [Database](#database)
   - [Containerization & Deployment](#containerization--deployment)
   - [Data Flow](#data-flow)
   - [Extensibility](#extensibility)
- [System Architecture Diagrams](#system-architecture-diagrams)
   - [Alternative Credit Rating and Credit Rating Explanation](#alternative-credit-rating-and-credit-rating-explanation)
   - [Credit Product Recommendation and Personalization](#credit-product-recommendation-and-personalization)
- [Agentic Workflow for Credit Recommendation](#agentic-workflow-for-credit-recommendation)
   - [Agentic Workflow Steps](#agentic-workflow-steps)
   - [Why Agentic Workflow?](#why-agentic-workflow)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development](#development)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Sample cURL Commands](#sample-curl-commands)
- [Installation & Deployment to AWS](#installation--deployment-to-aws)
   - [Environment Setup](#environment-setup)
   - [Configuration Files](#configuration-files)
   - [Prerequisites](#prerequisites-1)
   - [MongoDB Atlas Programmatic Access](#mongodb-atlas-programmatic-access)
   - [Minimum System Requirements](#minimum-system-requirements)
   - [One-Click Deployment](#one-click-deployment)
   - [Post-Deployment Verification](#post-deployment-verification)
- [License](#license)


## Features

- Secure user authentication and credit profile management
- Automated credit score calculation with explainability
- Personalized credit card product recommendations
- RESTful API endpoints for integration
- Containerized deployment using Docker Compose

## Architecture Overview

### Components

- **Backend**: Python (Flask) API for credit scoring, recommendations, and data management.
- **Frontend**: React/Next.js application for user interaction and visualization.
- **Database**: MongoDB for storing user profiles, credit scores, and recommendations.

### Backend

- **Framework**: Flask (Python)
- **Key Modules**:
    - `app.py`: Main Flask app, API endpoints for login, credit scoring, and product suggestions.
    - `credit_rating.py`: Loads ML models and computes credit scores.
    - `credit_score_expl.py`: Generates LLM-based explanations for credit scores.
    - `credit_product_recommender.py`: Recommends credit cards using LLM and vector search.
    - `graph.py`: Orchestrates agentic workflows with LangGraph.
    - `utils.py`: MongoDB connection and shared utilities.
    - `stat_score_util.py`: Traditional/statistical credit score calculations.
    - `dummy.py`: Data preprocessing utilities.
    - `llm_utils.py`: LLM and vector store setup (LangChain, Fireworks, MongoDB Atlas).
- **Persistence**: MongoDB (PyMongo), with collections for user data and responses.
- **ML/LLM**: Integrates pre-trained models (joblib), LangChain for LLM orchestration, and vector search for product retrieval.

### Frontend

- **Framework**: React/Next.js
- **Features**:
    - User login and authentication
    - Dashboard for credit profile and score visualization
    - Product recommendations display
    - Profile editing and updates
- **API Integration**: Communicates with backend via REST endpoints.

### Database

- **MongoDB**:
    - Stores user profiles, credit scores, recommendations, and product catalog.
    - Supports both transactional data and vector search for product recommendations.

### Containerization & Deployment

- **Docker Compose**: Orchestrates backend, frontend, and MongoDB containers.
- **Makefile**: Provides shortcuts for build, up, down, logs, backend, and frontend commands.

### Data Flow

1. **User Login**: Frontend sends credentials to `/login`. Backend authenticates and triggers agentic workflow.
2. **Credit Scoring**: Backend computes credit score using ML/statistical models and stores results in MongoDB.
3. **Recommendations**: LLM and vector search modules generate personalized credit card recommendations.
4. **Frontend Display**: User views credit profile, score, and recommendations. Profile updates trigger backend re-computation.

### Extensibility

- **ML Models**: Easily replaceable or upgradable (joblib files).
- **LLM/Vector Search**: Modular, allowing provider/model swaps.
- **API**: RESTful endpoints for integration with other systems.

---

## System Architecture Diagrams

The following diagrams illustrate the core workflows and architecture of the application:

### Alternative Credit Rating and Credit Rating Explanation

![Alternative credit Rating and Credit rating explanation](https://github.com/ashwin-gangadhar-mdb/mdb-bfsi-credit-reco-genai/blob/6b7a391b62cc6d9722af421c14157d4f7000dc3f/images/credit_rating_flow.jpg?raw=true)

This diagram depicts the alternative credit rating workflow:
- The Web UI and MongoDB provide user data and queries to a risk profiling ML pipeline.
- Model features and predictions are combined into a custom prompt for the LLM.
- The LLM, using its reasoning and knowledge modules, generates a user profile risk explanation, which is then returned to the UI.

### Credit Product Recommendation and Personalization

![Credit Product recommendation and personalization](https://github.com/ashwin-gangadhar-mdb/mdb-bfsi-credit-reco-genai/blob/6b7a391b62cc6d9722af421c14157d4f7000dc3f/images/recommendation_flow.jpg?raw=true)

This diagram shows the flow for generating refined credit card product suggestions:
- The Web UI interacts with the API, which leverages LangChain's Multi Query Retriever and MongoDB Vector Search to fetch relevant product data from a private knowledge base.
- Retrieved suggestions and summarized documents are passed to an LLM, which uses its reasoning and knowledge modules to refine the recommendations before returning them to the user.

> **Note:** The images above are located in the `assets/` directory. If not present, please add the images as `credit_product_recommendation.png` and `alternative_credit_rating.png` for correct rendering.

---

## Agentic Workflow for Credit Recommendation

This application uses an **agentic workflow** to orchestrate the end-to-end process of credit profile analysis and personalized product recommendation. The workflow is implemented as a directed graph (state machine) in the backend (`graph.py`), ensuring modularity, traceability, and extensibility.

### Agentic Workflow Steps

The agentic workflow consists of the following steps:

1. **Start**  
   The workflow begins when a user requests credit recommendations.

2. **Check if User Exists**  
   The system checks if the user's profile already exists in the database and is up-to-date.  
   - If up-to-date, it skips to generating recommendations.
   - Otherwise, it proceeds to build or update the credit profile.

3. **Credit Profile Construction**  
   The system gathers the user's credit data, predicts their credit score and allowed credit limit, and generates an explanation for the score. This information is saved to the database.

4. **Generate Recommendations**  
   Based on the user's profile, the system suggests the most relevant credit card products using LLMs and vector search.

5. **Rerank Recommendations**  
   The recommendations are refined and reranked to ensure the best fit for the user.

6. **Validate and Save**  
   The system validates the recommendations and profile, then persists the final results to the database.

7. **End**  
   The workflow concludes, and the results are returned to the user.

#### Agentic Workflow Diagram

Below is a simplified diagram of the agentic workflow:

![Agentic workflow](https://github.com/ashwin-gangadhar-mdb/mdb-bfsi-credit-reco-genai/blob/6b7a391b62cc6d9722af421c14157d4f7000dc3f/images/graph.png?raw=true)

> **Note:** The actual implementation uses a state graph (see `graph.py`) with checkpointing and conditional transitions for robustness.

### Why Agentic Workflow?

- **Modularity:** Each step is a self-contained function, making the workflow easy to extend or modify.
- **Traceability:** Intermediate and final results are persisted to MongoDB at each step.
- **Resilience:** The workflow can resume from checkpoints in case of failures.
- **Explainability:** The system provides not just recommendations, but also explanations for credit scores and product choices.

For a detailed technical breakdown, see the documentation in `graph.md` and the implementation in `backend_agentic/graph.py`.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/)

## Quick Start

### 1. Clone the Repository

```sh
git clone <repo-url>
cd mdb-bfsi-credit-reco-genai
```

### 2. Configure Environment Variables

Edit the `.env` file in the root directory as needed. Example:

```env
FIREWORKS_API_KEY=fw_
FIREWORKS_MODEL_ID=
# mongodb atlas config
API_PUBLIC_KEY=
API_PRIVATE_KEY=
GROUP_ID=
# aws config
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
# Add other keys as needed
```

### 3. Build and Run with Docker Compose

```sh
make build
make up
```

This will build and start the following services:

- **backend**: Python backend (Flask) on ports 8000 and 5001
- **frontend**: Node.js frontend on port 3000
- **mongo**: MongoDB database on port 27017

### 4. Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

### 5. Stopping the Application

```sh
make down
```

## Development

- View logs: `make logs`

## API Endpoints

- `POST /login`: User login
- `GET /credit_score/<user_id>`: Retrieve credit score and profile
- `POST /product_suggestions`: Get product recommendations (expects JSON body)
- `GET /product_suggestions/<user_id>`: Get product recommendations by user ID

## Project Structure

```
backend_agentic/   # Python backend code
frontend/          # Frontend code (React/Next.js)
docker-compose.yaml
.env
Makefile
```

## Testing

To run backend tests:

```sh
cd backend_agentic
python test_app.py 
```

## Sample cURL Commands

Here are example `curl` commands to test the main API endpoints once docker images are started:

### User Login
use 
`username: 4911 ; password: mark`
or
`username: 8625 ; password: rick`

```sh
curl -X POST http://localhost:5001/login \
    -H "Content-Type: application/json" \
    -d '{"username": "4911", "password": "mark"}'
```

### Retrieve Credit Score and Profile
`user_id: 4911` or `user_id: 8625`

```sh
curl http://localhost:5001/credit_score/<user_id>
```

Replace `<user_id>` with the actual user ID.

### Get Product Recommendations (by profile)

```sh
curl -X POST http://localhost:5001/product_suggestions \
    -H "Content-Type: application/json" \
    -d '{
  "allowedCreditLimit": 5455,
  "scoreCardCreditScore": 679,
  "scorecardScoreFeatures": {
    "Credit History": 0.5668409143500507,
    "Credit Utilization": 0.7121811222334029,
    "Num Credit Inquiries": 0.6789768760750308,
    "Outstanding": 0.0034585776676617774,
    "Repayment History": 0.9537815126050421
  },
  "userCreditProfile": "Standard",
  "userId": 4911,
  "userProfile": "Based on the provided user profile, the Credit Health is classified as \"Standard\". This indicates that the individual has a moderate credit history and is not considered high-risk, but there is room for improvement.\n\nThe Processed Credit Limit for the user is $5455, which suggests that the individual has a reasonable credit capacity. However, it's essential to note that this limit is not excessively high, indicating that the individual may not have an extensive credit history or a high income.\n\nThe primary factors contributing to the \"Standard\" Credit Health are:\n\n* A moderate credit utilization ratio of 28.78%, indicating that the individual is using a significant portion of their available credit.\n* A relatively high number of delayed payments (11) and an average delay of 26 days from the due date, suggesting that the individual may struggle with timely payments.\n* A moderate interest rate of 17% on their credit card, which may indicate that the individual is not taking advantage of lower-interest credit options.\n* A limited credit mix, classified as \"Standard\", which may indicate that the individual does not have a diverse range of credit types.\n\nTo improve their Credit Health and increase their Processed Credit Limit, the individual can take the following corrective actions:\n\n* Make timely payments to reduce the number of delayed payments and average delay from the due date.\n* Consider consolidating debt or negotiating lower interest rates on their credit card.\n* Diversify their credit mix by exploring other credit options, such as personal loans or mortgages.\n* Monitor and manage their credit utilization ratio to ensure it remains below 30%.\n\nBy taking these steps, the individual can work towards improving their Credit Health and increasing their credit capacity over time."
}'
```

Replace `<user_id>` and provide the required profile data as JSON.

### Get Product Recommendations (by user ID)

```sh
curl http://localhost:5001/product_suggestions/<user_id>
```

Replace `<user_id>` with the actual user ID.

---

## Installation & Deployment to AWS

### Environment Setup

The system requires:
- MongoDB Atlas cluster
- AWS credentials for Bedrock access
- Docker and Docker Compose

### Configuration Files

Each service has its own `.env` file for configuration:
- **MongoDB Configuration**:
  - `MONGODB_CONNECTION_STR`: Connection string
- **AWS Configuration**:
  - `AWS_REGION`: AWS region
  - `AWS_ACCESS_KEY_ID`: Access key
  - `AWS_SECRET_ACCESS_KEY`: Secret key
  - `FIREWORKS_API_KEY`: Access to Fireworks serverless models
  - `FIREWORKS_MODEL_ID`: LLM Model ID you choose to use

### Prerequisites

- AWS account with appropriate permissions
- MongoDB Atlas account with appropriate permissions
- Python 3.10+
- Docker and Docker Compose installed
- AWS CLI installed and configured
- EC2 quota for `t3.medium`
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

### Minimum System Requirements

- Sufficient CPU and memory for running Docker containers
- Adequate network bandwidth for data transfer and API calls
- For EC2: At least a `t3.medium` instance (or higher, depending on workload)
- Sufficient EBS storage for EC2 instance (at least 100 GB recommended)
- MongoDB Atlas M10 Cluster (auto-deployed by the `one-click` script)

### One-Click Deployment

The `one-click.ksh` Korn shell script automates the deployment of the MongoDB - Fireworks Quickstart application on AWS infrastructure. It sets up the necessary AWS resources, deploys an EC2 instance, and configures the application environment.

#### Prerequisites
- AWS CLI installed and configured with appropriate credentials
- Access to a MongoDB Atlas account with necessary permissions
- Korn shell (ksh) environment

#### Execution Flow
1. Initialize logging
2. Create or use existing EC2 key pair
3. Deploy infrastructure CloudFormation stack
4. Retrieve and store infrastructure stack outputs
5. Deploy EC2 instance and application CloudFormation stack
6. Start streaming EC2 deployment logs
7. Monitor application URL until it becomes available
8. Launch application URL in default browser

#### Logging
You can monitor all the steps of one click deployment scripts by tailing the following files
- Main deployment logs: `./logs/one-click-deployment.log`
- EC2 live logs: `./logs/ec2-live-logs.log`

#### Error Handling
The script includes basic error checking for critical operations such as CloudFormation stack deployments. If an error occurs, the script will log the error and exit.

#### Security Considerations
- AWS credentials are expected to be set as environment variables
- MongoDB Atlas credentials and API keys are passed as CloudFormation parameters

#### Customization
To customize the deployment:
1. Modify the CloudFormation template files (`deploy-infra.yaml` and `deploy-ec2-using-ecr.yaml`)
2. Adjust the deployment parameters at the beginning of the script
3. Update the AMI IDs in the `ami_map` if newer AMIs are available

#### Troubleshooting
- Check the log files for detailed information on the deployment process
- Ensure all required environment variables and parameters are correctly set
- Verify AWS CLI configuration and permissions
- Check CloudFormation stack events in the AWS Console for detailed error messages

#### Limitations
- The script is designed for a specific application stack and may require modifications for other use cases
- It assumes a certain MongoDB Atlas and AWS account setup
- The script does not include rollback mechanisms for partial deployments. In case of partial failures, delete the related CloudFormation stacks from AWS Console.

#### Deployment Steps
1. Clone the repository:
   ```
   git clone <repository-url>
   cd mdb-bfsi-credit-reco-genai
   ```
2. Configure the `.env` file:
   - AWS Auth: Specify the `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` for deployment.
   - Authentication Keys: Fetch Project ID, API public and private keys for MongoDB Atlas Cluster setup. Update the script file with the keys for `APIPUBLICKEY`, `APIPRIVATEKEY`, `GROUPID` suitably.
3. Deploy the application:

   ```sh
   make deploy-aws-ec2
   ```
4. Access the application at `http://<ec2-instance-ip>:3000`

#### Post-Deployment Verification
1. Access the UI service by navigating to `http://<ec2-instance-ip>:3000` in your web browser.
2. Test the system by entering a query and verifying that you receive an appropriate AI-generated response.
3. Try uploading a file to ensure the Loader Service is functioning correctly.
4. Verify that the sample dataset bundled with the script is loaded into your MongoDB Cluster name `MongoDBFireworksV1` with the database `bfsi-genai` and collections `cc-products` and `user-data` by visiting the [MongoDB Atlas Console](https://cloud.mongodb.com).

## License

MIT License (add your license here)
