# MongoDB - Firework Quickstart

## BFSI Credit Recommendation & Scoring Application

A modular, containerized full-stack solution for BFSI credit recommendation and scoring, featuring a Python/Flask backend, a React/Next.js frontend, and MongoDB for persistent storage.

[![ReadMe Card](https://github-readme-stats.vercel.app/api/pin/?username=ashwin-gangadhar-mdb&repo=mdb-bfsi-credit-reco-genai)](https://github.com/ashwin-gangadhar-mdb/mdb-bfsi-credit-reco-genai)

## Demo Video

Watch a walkthrough of the MongoDB Credit Scoring Application:

[![Demo Video](https://img.youtube.com/vi/tUgSCnGjTI0/0.jpg)](https://youtu.be/tUgSCnGjTI0?t=1486)

## Table of Contents

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
   - [Agentic Workflow Diagram](#agentic-workflow-diagram)
   - [Why Agentic Workflow?](#why-agentic-workflow)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development](#development)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Sample cURL Commands](#sample-curl-commands)
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
MONGO_CONNECTION_STRING=mongodb://root:example@mongo:27017/?authSource=admin
FIREWORKS_API_KEY=fw_
NEXT_PUBLIC_API_URL=http://localhost:5001
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
- Start only backend or frontend: `make backend` or `make frontend`

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
python -m pytest test_app.py 
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

## License

MIT License (add your license here)
