# 🧪 Dr. Reddy's Pharma Product QnA Assistant

> **Build an AI-powered assistant for pharmaceutical representatives to answer product questions and check inventory**

## 📋 Overview

This demonstration showcases a complete solution for pharmaceutical representatives who need instant access to accurate product information and real-time inventory data while in the field meeting with healthcare providers.

### ✅ Key Capabilities

| Capability | Description |
|------------|-------------|
| **Product Knowledge** | Answer detailed questions about medication indications, contraindications, dosages, and side ef# 🧠 PHASE 2B: MCP SERVER INTEGRATIONects |
| **Inventory Management** | Check real-time stock levels across multiple distribution centers# 🚀 PHASE 3: VALIDATION & EXPANSION|
| **Memory** | Maintain conversation context and recall previous interactions |
| **Compliance** | Generate accurate responses based only on approved documentation |

## 🏗️ Solution Architecture

```mermaid
graph TB
    %% Data Sources
    subgraph "Data Sources"
        PDF[Dr. Reddy's Product PDFs<br/>📄 Package Inserts<br/>📄 Technical Documentation]
        JSON[Structured Product Data<br/>📊 dr_reddys_products.json]
    end

    %% Phase 1: Data Pipeline
    subgraph "Phase 1: Data Pipeline"
        subgraph "MAAP Data Loader"
            DL[Document Downloader<br/>🔄 Python Scripts]
            PROC[PDF Processor<br/>⚙️ Text Extraction<br/>⚙️ Embedding Generation]
        end
        
        subgraph "Data Processing"
            EMB[Embedding Models<br/>🧠 VoyageAI<br/>🧠 AWS Bedrock Titan]
            STRUCT[Structured Data Ingester<br/>📝 Products & Inventory]
        end
    end

    %% MongoDB Atlas
    subgraph "MongoDB Atlas"
        subgraph "Unstructured Data"
            PROD_DOCS[(product_documents<br/>📚 Vector embeddings<br/>📚 PDF content)]
        end
        
        subgraph "Structured Data"
            PRODUCTS[(products<br/>💊 Brand names<br/>💊 Molecules)]
            INVENTORY[(inventory<br/>📦 Stock levels<br/>📦 Distribution centers)]
            CENTERS[(distribution_centers<br/>🏢 Locations<br/>🏢 Contact info)]
        end
        
        subgraph "Agent State"
            CHECKPOINTS[(checkpoints<br/>💾 Conversation state)]
        end
    end

    %% Phase 2: Agent Creation
    subgraph "Phase 2: Agent Builder"
        subgraph "MAAP Agent Builder"
            CONFIG[Agent Configuration<br/>⚙️ agents.yaml<br/>⚙️ System prompts]
            TOOLS[Agent Tools<br/>🔍 Vector Search<br/>🔍 Full-text Search<br/>🧠 AI Memory]
        end
        
        subgraph "Language Models"
            LLM[Claude 3.5 Sonnet<br/>🤖 AWS Bedrock]
        end
    end

    %% Phase 2B: MCP Integration
    subgraph "Phase 2B: Memory MCP Server"
        subgraph "MCP Services"
            MCP_MAIN[Memory MCP Main<br/>🔄 HTTP Server]
            AI_MEM[AI Memory Service<br/>🧠 Conversation Memory]
            SEM_CACHE[Semantic Cache<br/>⚡ Response Caching]
            LOGGER[Event Logger<br/>📝 Activity Logging]
        end
        
        subgraph "Memory Database"
            MEM_DB[(memory_mcp<br/>💭 Conversation history<br/>💭 Semantic cache)]
        end
    end

    %% Phase 3: Application Layer
    subgraph "Phase 3: Pharmaceutical Assistant"
        subgraph "API Layer"
            API[REST API<br/>🌐 /chat endpoint<br/>🌐 HTTP interface]
            WEB[Web Interface<br/>💻 Browser UI]
        end
        
        subgraph "Agent Core"
            AGENT[Pharma Sales Rep Agent<br/>🤖 React Agent<br/>🤖 Tool Integration]
        end
    end

    %% End Users
    subgraph "End Users"
        SALES_REP[Pharmaceutical Sales Representatives<br/>👨‍💼 Field interactions<br/>👨‍💼 Customer meetings]
        HCP[Healthcare Providers<br/>👩‍⚕️ Doctors<br/>👩‍⚕️ Pharmacists]
    end

    %% Data Flow Connections
    PDF --> DL
    JSON --> STRUCT
    DL --> PROC
    PROC --> EMB
    EMB --> PROD_DOCS
    STRUCT --> PRODUCTS
    STRUCT --> INVENTORY
    STRUCT --> CENTERS

    %% Agent Builder Connections
    CONFIG --> TOOLS
    TOOLS --> AGENT
    LLM --> AGENT
    PROD_DOCS --> TOOLS
    PRODUCTS --> TOOLS
    INVENTORY --> TOOLS
    CENTERS --> TOOLS
    CHECKPOINTS --> AGENT

    %% MCP Connections
    MCP_MAIN --> AI_MEM
    MCP_MAIN --> SEM_CACHE
    MCP_MAIN --> LOGGER
    AI_MEM --> MEM_DB
    SEM_CACHE --> MEM_DB
    TOOLS --> MCP_MAIN

    %% Application Connections
    AGENT --> API
    API --> WEB
    API --> SALES_REP
    SALES_REP --> HCP

    %% Styling
    classDef dataSource fill:#e1f5fe
    classDef processing fill:#f3e5f5
    classDef database fill:#e8f5e8
    classDef agent fill:#fff3e0
    classDef mcp fill:#fce4ec
    classDef api fill:#f1f8e9
    classDef user fill:#e3f2fd

    class PDF,JSON dataSource
    class DL,PROC,EMB,STRUCT processing
    class PROD_DOCS,PRODUCTS,INVENTORY,CENTERS,CHECKPOINTS,MEM_DB database
    class CONFIG,TOOLS,LLM,AGENT agent
    class MCP_MAIN,AI_MEM,SEM_CACHE,LOGGER mcp
    class API,WEB api
    class SALES_REP,HCP user
```
| Component | Purpose |
|-----------|---------|
| **MAAP Data Loader** | Ingest and process pharmaceutical documentation (PDFs, package inserts, technical data) |
| **MAAP Agent Builder** | Create a conversational AI interface with specialized tool-calling capabilities |
| **MongoDB Atlas** | Store and query both unstructured product knowledge and structured inventory data |
| **Memory MCP Server** | Store and manage conversational memory for contextual responses |

## 🔄 Implementation Process

This implementation guide is organized into three sequential phases:

### 📊 Phase 1: Data Pipeline
- Download pharmaceutical product PDFs from Dr. Reddy's
- Process documents using MAAP Data Loader
- Extract and index meaningful content
- Import structured inventory and product data

### 🤖 Phase 2: Agent Creation
- Configure the pharmaceutical representative agent
- Set up vector search for product knowledge
- Integrate MongoDB tools for inventory queries
- Define agent behavior parameters

### 🧪 Phase 3: Validation
- Test with representative medical field queries
- Verify accuracy against official documentation
- Confirm inventory checking capabilities
- Evaluate response quality and compliance

# 📚 PHASE 1: DATA PIPELINE

> **Ingest and process Dr. Reddy's pharmaceutical documentation**

This phase walks through setting up the data pipeline that will power your pharmaceutical assistant. We'll process product documentation and create searchable collections in MongoDB Atlas.

## ⚙️ Prerequisites

Before starting, verify you have the following components ready:

| Requirement | Details |
|-------------|---------|
| **MongoDB Atlas** | Active cluster with connection string |
| **MAAP Data Loader** | Installed and configured |
| **Python Environment** | Python 3.8+ with required libraries |
| **Source Data** | Access to Dr. Reddy's product documentation URLs |
| **AWS Account** | Optional: For AWS Bedrock embedding generation |

## 🛠️ Setup Process

### Step 1: Environment Configuration

First, set up your development environment:

```bash
# Clone the repository
git clone https://github.com/mongodb-partners/maap-data-loader.git
cd maap-data-loader

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Configuration File Setup

Create a `.env` file in the project root directory:

```ini
#===================================
# MongoDB Configuration
#===================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
MONGODB_DATABASE=dr_reddys_demo
MONGODB_COLLECTION=product_documents

#===================================
# AWS Configuration
#===================================
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

#===================================
# Application Settings
#===================================
LOCAL_FILE_OUTPUT_DIR=./processed_files
RUN_ENV=local
```

### Step 3: Document Collection

#### 3.1 Download Product Documentation

Gather Dr. Reddy's pharmaceutical product documentation using the provided scripts:

**Python Script (Advanced)**
```bash
# Navigate to the data directory
cd data

# Install required dependencies
pip install requests pdfkit selenium webdriver-manager

# Execute the Python downloader with options
python download_urls.py --output-dir ./pdf_downloads --concurrent 3

# Return to project root
cd ..
```

#### 3.2 Document Content Overview

The downloaded PDFs contain comprehensive pharmaceutical information:

| Content Type | Description |
|--------------|-------------|
| Active Ingredients | Chemical compounds and their concentrations |
| Indications | Approved medical uses and conditions |
| Contraindications | Situations when medication should not be used |
| Dosage Information | Recommended dosages by age, weight, condition |
| Side Effects | Common and rare adverse reactions |
| Storage Instructions | Temperature, humidity and handling requirements |
| Regulatory Information | Approval details and compliance data |

## 🔄 Data Processing Workflow

### Step 4: Document Processing

#### 4.1 Start the Data Processing Service

Launch the MAAP Data Loader service:

```bash
# Start the processing server
python app.py
```

#### 4.2 Verify Service Health

Confirm the service is running correctly:

```bash
curl -X GET http://localhost:8000/health
```

Expected response:
```json
{"status": "healthy"}
```

#### 4.3 Process Individual Documents

Process a single document to test the pipeline:

```bash
# Process a single PDF file
curl -X POST http://localhost:8000/local/upload \
  -H "Content-Type: multipart/form-data" \
  -F "files=@./data/pdf_downloads/all5-17.07.2024.pdf" \
  -F 'json_input_params={
    "user_id": "dr_reddys_demo",
    "mongodb_config": {
      "uri": "mongodb+srv://username:password@cluster.mongodb.net",
      "database": "dr_reddys_demo",
      "collection": "product_documents",
      "index_name": "vector_index",
      "text_field": "text",
      "embedding_field": "embedding"
    }
  }'
```

#### 4.4 Batch Process All Documents

Create and execute a batch processing script for all documents:

```bash
# Create batch processing script
cat > process_all_pdfs.sh << 'EOF'
#!/bin/bash

PDF_DIR="./data/pdf_downloads"
PROCESSED=0
TOTAL=$(find "$PDF_DIR" -name "*.pdf" | wc -l)

echo "🔄 Starting batch processing of $TOTAL PDF files"

for pdf_file in "$PDF_DIR"/*.pdf; do
  if [ -f "$pdf_file" ]; then
    PROCESSED=$((PROCESSED+1))
    FILENAME=$(basename "$pdf_file")
    
    echo "📄 [$PROCESSED/$TOTAL] Processing: $FILENAME"
    
    curl -s -X POST http://localhost:8000/local/upload \
      -H "Content-Type: multipart/form-data" \
      -F "files=@$pdf_file" \
      -F 'json_input_params={
        "user_id": "dr_reddys_demo",
        "mongodb_config": {
          "uri": "mongodb+srv://username:password@cluster.mongodb.net",
          "database": "dr_reddys_demo",
          "collection": "product_documents",
          "index_name": "vector_index",
          "text_field": "text",
          "embedding_field": "embedding"
        }
      }'
      
    echo -e "\n⏱️ Waiting 2 seconds before next file..."
    sleep 2
  fi
done

echo "✅ Completed processing $PROCESSED files"
EOF

# Make the script executable
chmod +x process_all_pdfs.sh

# Run the batch processing script
./process_all_pdfs.sh
```

#### 4.5 Expected Processing Results

Each successfully processed document will return:

```json
{
  "success": true,
  "message": "Upload processed successfully",
  "details": {
    "files_processed": 1,
    "urls_processed": 0,
    "documents_stored": 1,
    "file_list": ["all5-17.07.2024.pdf"],
    "url_list": []
  }
}
```

## 🔍 Verification Process

### Step 5: Data Validation

#### 5.1 MongoDB Atlas Web Interface

Verify proper document ingestion using the MongoDB Atlas web interface:

1. Log in to your [MongoDB Atlas account](https://cloud.mongodb.com)
2. Navigate to your project > Database > Browse Collections
3. Select the `dr_reddys_demo` database
4. Examine the `product_info` collection
5. Confirm documents contain the following structure:

```json
{
  "_id": ObjectId("..."),
  "text": "ALLERWAY 5: COMPOSITION: Each film-coated tablet contains levocetirizine dihydrochloride 5 mg...",
  "embedding": [0.023, -0.128, 0.332, ...],
  "user_id": "dr_reddys_demo",
  "metadata": {
    "filename": "all5-17.07.2024.pdf",
    "processed_at": "2025-08-08T10:23:45Z",
    "pages": 4,
    "file_type": "application/pdf"
  }
}
```

#### 5.2 MongoDB Compass (Desktop Client)

For more advanced validation using the MongoDB Compass desktop client:

1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your MongoDB Atlas connection string
3. Navigate to the `dr_reddys_demo.product_info` collection
4. Run sample validation queries:

**Sample Query 1: Find documents by product name**
```javascript
{text: {$regex: "Cifloc", $options: "i"}}
```

**Sample Query 2: Find documents with dosage information**
```javascript
{text: {$regex: "recommended dose|dosage|administered", $options: "i"}}
```

**Sample Query 3: Find documents with side effects**
```javascript
{text: {$regex: "adverse|side effects|warnings", $options: "i"}}
```

# 📊 PHASE 1B: STRUCTURED DATA INTEGRATION

> **Enhance your agent with real-time inventory and product data**

While PDF content provides valuable pharmaceutical information, structured data gives your agent access to precise, queryable business data like inventory levels and product specifications.

## 🗃️ MongoDB Inventory Integration

### Step 1: Prepare Structured Data Schema

Our inventory system will track products across multiple distribution centers with the following information:
- Product ID and name
- Batch numbers and expiration dates
- Quantity available
- Distribution center location
- Pricing information

### Step 2: Run Data Ingestion Script

Execute our structured data ingestion script:

```bash
# Navigate to the demo directory
cd dr_reddy_pharma_sales_rep_demo

# Execute the import script
python ingest_structured_data.py \
  --mongodb-uri "mongodb+srv://username:password@cluster.mongodb.net" \
  --database "dr_reddys_demo" \
  --products-collection "products" \
  --inventory-collection "inventory" \
  --centers-collection "distribution_centers"
```

### Step 3: Script Functionality

The `ingest_structured_data.py` script performs these key operations:

| Operation | Description |
|-----------|-------------|
| **Data Loading** | Imports structured product data from `data/dr_reddys_products.json` |
| **Collection Creation** | Creates and populates three interrelated collections |
| **Relationship Building** | Establishes connections between products, documents, and inventory |
| **Data Enrichment** | Adds computed fields and search optimizations |

### Step 4: Data Model Overview

The script creates a comprehensive data model with these collections:

**Collection: `products`**
```javascript
{
  "_id": ObjectId("..."),
  "brand_name": "Allerway 5",
  "molecule": "Levocetirizine Dihydrochloride",
  "therapy": "Antihistaminics",
  "dosage_form": "Tabs",
  "package_insert_url": "https://www.drreddys.co.za/sites/.../all5-17.07.2024.pdf",
  "document_id": ObjectId("..."),  // Link to unstructured PDF data
  "search_text": "Allerway 5 Levocetirizine Dihydrochloride"
}
```

**Collection: `inventory`**
```javascript
{
  "_id": ObjectId("..."),
  "product_id": ObjectId("..."),
  "distribution_center_id": ObjectId("..."),
  "quantity": 315,
  "last_updated": ISODate("2025-08-08T12:34:56Z"),
  "reorder_level": 50,
  "available": true
}
```

**Collection: `distribution_centers`**
```javascript
{
  "_id": ObjectId("..."),
  "name": "Mumbai Central",
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India"
  },
  "address": "123 Main Street, Mumbai",
  "contact": "+91-9876543210"
}
```

### Step 5: Verify Data Ingestion

A successful import will show this output:

```
🔄 Loading data from ./data/dr_reddys_products.json
✅ Successfully connected to MongoDB Atlas
📊 Created products collection with 38 products
📦 Created inventory collection with 152 inventory records
🏢 Created distribution centers collection with 12 centers
🔗 Successfully linked PDF documents with product data
```

## 🔄 Dual-Data Advantage

With both unstructured and structured data sources integrated, your agent can now:

1. **Access Deep Knowledge**: Retrieve detailed pharmaceutical information from product documentation
2. **Provide Business Context**: Offer real-time inventory levels, pricing, and availability information
3. **Answer Complex Queries**: Respond to questions that require both knowledge types:
   - "What is the recommended dosage for Allerway 5 and is it available in the Boston distribution center?"
   - "Tell me about the side effects of Reegen-D 15000 and check if it's available for expedited shipping from our New York warehouse."

# 🤖 PHASE 2: AGENT CREATION

> **Build an intelligent pharmaceutical assistant with MAAP Agent Builder**

Now that our data pipeline is complete with both unstructured (PDFs) and structured (products/inventory) data in MongoDB Atlas, we'll install, configure, and deploy a specialized agent for pharmaceutical representatives.

## 🔧 Installing MAAP Agent Builder

Before configuring your agent, you need to set up the MAAP Agent Builder framework:

```bash
# Clone the repository
git clone https://github.com/mongodb-partners/maap-agent-builder.git
cd maap-agent-builder

# Set up a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install the package
pip install -e .

# Create necessary directories
mkdir -p config logs prompts
```

### Required Dependencies

The agent builder requires several key dependencies:

```bash
# Install core dependencies for MongoDB integration
pip install pymongo langchain-mongodb

# Install embedding providers
pip install voyageai boto3 langchain-aws

# Install MCP dependencies for memory capabilities
pip install langchain-mcp-adapters fastmcp
```

## 🛠️ Agent Configuration

### Step 1: YAML Configuration

Create or update your `config/agents.yaml` file with the following configuration:

```yaml
#===================================
# Dr. Reddy's Pharma Sales Rep Agent - Configuration
#===================================

# Configure the embedding models
embeddings:
  - name: voyage_embeddings
    provider: voyageai
    model_name: voyage-3.5-lite
    additional_kwargs:
      output_dimension: 512
  - name: bedrock-titan
    provider: bedrock
    model_name: amazon.titan-embed-text-v1

# Configure the language model
llms:
  - name: claude-3.5
    provider: bedrock
    model_name: anthropic.claude-3-5-sonnet-20240620-v1:0
    temperature: 0.7
    max_tokens: 4096

# Configure agent tools
tools:
  # Product Availability Tool (Full-text search)
  - name: product_availability
    tool_type: full_text_search
    description: Checks product availability of the product in the MongoDB database
    connection_str: ${MONGODB_URI:-mongodb://localhost:27017}
    namespace: dr_reddys.product_inventory
    additional_kwargs:
      index_name: full_text_search_index
      text_field: search_text
      top_k: 5
      
  # Product Information Tool (Vector search)
  - name: product_information
    tool_type: vector_search
    description: Searches for relevant documents in the vector store to help with FAQ on dr reddys product information
    connection_str: ${MONGODB_URI:-mongodb://localhost:27017}
    namespace: dr_reddys.product_info
    embedding_model: voyage_embeddings  # Reference to the embedding model defined above
    additional_kwargs:
      index_name: vector_index
      top_k: 3
      min_score: 0.7
      
  # AI Memory Tool (MCP server integration)
  - name: ai-memory
    tool_type: mcp
    description: MongoDB MCP Toolkit for advanced data operations
    servers_config:
      "ai-memory":
        url: "http://localhost:8080/mcp"
        transport: "streamable_http"
        filter:
          - store_memory
          - retrieve_memory
          - semantic_cache_response

# Configure checkpointing
checkpointer:
  connection_str: ${MONGODB_URI:-mongodb://localhost:27017}
  db_name: dr_reddy_agent_state
  collection_name: checkpoints
  name: rag_agent_checkpointer

# Configure the agent
agent:
  name: rag_react_agent
  agent_type: react
  llm: claude-3.5  # Reference to the LLM defined above
  tools:
    - product_information  # References to the tools defined above
    - product_availability
    - ai-memory
  system_prompt_path: ./prompts/rag_system_prompt.txt
```

### Step 2: Agent Deployment

Launch the agent service with all required environment variables:

```bash
# Set required environment variables
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net"
export AWS_ACCESS_KEY_ID="your_aws_access_key"
export AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
export AWS_REGION="us-east-1"
export VOYAGE_API_KEY="your_voyage_api_key"  # Required for voyage embeddings

# Start the agent service
python -m agent_builder.cli serve \
  --config config/agents.yaml \
  --host 0.0.0.0 \
  --port 5000
```

### Step 3: Create System Prompt

Create a system prompt file that defines your agent's behavior and capabilities:

```bash
# Create the prompts directory if it doesn't exist
mkdir -p prompts

# Create the system prompt file
cat > prompts/rag_system_prompt.txt << 'EOF'
# Pharmaceutical Sales Representative Assistant

You are an AI assistant specialized in helping pharmaceutical sales representatives with detailed product information, inventory management, and clinical knowledge.

## Your Capabilities

- Access detailed pharmaceutical product information including indications, contraindications, dosages, side effects
- Check real-time inventory levels across distribution centers
- Maintain conversation memory to provide contextual assistance
- Generate compliant, factual responses based only on approved documentation

## Guidelines

1. Always provide factually accurate information based on official Dr. Reddy's product documentation
2. When discussing medications, include important safety information and contraindications
3. For inventory queries, provide specific details on availability, location, and quantity
4. Use professional, clear language appropriate for pharmaceutical professionals
5. Maintain conversation context by referencing relevant details from previous exchanges
6. If unsure about any information, clearly state the limitations of your knowledge
7. Do not provide medical advice beyond what is contained in official product documentation

Remember: Your responses will be used by pharmaceutical representatives when speaking with healthcare professionals, so accuracy and compliance are essential.
EOF
```

### Step 4: Agent Validation

Test the agent through the API:

```bash
# Example API request
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What are the indications for Allerway 5?"}
    ],
    "config": {
      "thread_id": "user-session-123",
      "recursion_limit": 10,
    }
  }'
```

Or access the web interface by opening: [http://localhost:5000](http://localhost:5000)

## 📝 Example Prompts for Testing

Test your agent with these pharmaceutical representative scenarios:

| Category | Example Prompt |
|----------|---------------|
| **Product Information** | "What are the side effects of Cifloc and how do they compare to similar antibiotics?" |
| **Dosage Guidance** | "A doctor is considering prescribing Alnedra to an elderly patient with kidney issues. What's the recommended dosage adjustment?" |
| **Inventory Check** | "I'm meeting with a hospital pharmacy manager tomorrow. What's our current inventory level of Drymed 500 in the Mumbai distribution center?" |
| **Safety Information** | "A patient is pregnant in her second trimester. Are there any contraindications for using Cifloc in her case?" |
| **Storage Requirements** | "A clinic in a rural area without reliable refrigeration asks about Lenap 10mg. What are the storage requirements?" |
| **Combined Query** | "I need information about Reegen-D 15000 for a dermatology clinic. What are the key benefits and do we have enough stock to fulfill a large order?" |

# � PHASE 2B: MCP SERVER INTEGRATION

> **Enhance your agent with MongoDB Memory MCP server integration**

After configuring the basic agent, you can extend its capabilities by integrating with the MongoDB Memory MCP server, providing advanced memory management, semantic caching, and hybrid search functionality.

## 🛠️ Memory MCP Setup

The MongoDB Memory MCP server provides powerful memory management for conversational agents, allowing them to store and retrieve information across sessions.

### Step 1: Clone the Memory MCP Repository

```bash
# Clone the MongoDB Memory MCP repository
git clone https://github.com/mongodb-partners/memory-mcp.git
cd memory-mcp

# Create necessary environment files from examples
cp .env.example .env
```

### Step 2: Configure Environment Variables

Edit the `.env` file with your MongoDB and AWS credentials:

```ini
# Core Application Settings
APP_NAME=memory-mcp
DEBUG=False
PORT=8080

# Service URLs (default Docker Compose settings)
LOGGER_SERVICE_URL=http://event-logger:8181
AI_MEMORY_SERVICE_URL=http://ai-memory:8182
SEMANTIC_CACHE_SERVICE_URL=http://semantic-cache:8183

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
DATABASE_NAME=memory_mcp
COLLECTION_NAME=memory

# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
EMBEDDING_MODEL_ID=amazon.titan-embed-text-v1
LLM_MODEL_ID=us.anthropic.claude-3-sonnet-20240229-v1:0
VECTOR_DIMENSION=1536

# External APIs
TAVILY_API_KEY=your_tavily_api_key
```

### Step 3: Deploy Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Verify deployment
docker-compose ps
docker-compose logs memory-mcp
```

## 💡 Integrating Memory MCP with Agent Builder

### Step 1: Update Agent Configuration

Your `config/agents.yaml` file already includes the Memory MCP integration with the `ai-memory` tool. Here's the relevant section highlighting the MCP configuration:

```yaml
# AI Memory Tool Configuration
tools:
  # Other tools configuration...
  
  # Memory MCP Integration
  - name: ai-memory
    tool_type: mcp
    description: MongoDB MCP Toolkit for advanced data operations
    servers_config:
      "ai-memory":
        url: "http://localhost:8080/mcp"
        transport: "streamable_http"
        filter:
          - store_memory
          - retrieve_memory
          - semantic_cache_response

# Agent configuration using the Memory MCP tool
agent:
  name: rag_react_agent
  agent_type: react
  llm: claude-3.5
  tools:
    - product_information
    - product_availability
    - ai-memory  # AI Memory tool is included in the agent's toolset
  system_prompt_path: ./prompts/rag_system_prompt.txt
```

### Step 2: Understanding Memory MCP Tools

The Memory MCP server provides several powerful tools that enhance your pharmaceutical sales rep agent:

| Tool | Purpose | Benefits |
|------|---------|----------|
| **store_memory** | Save conversation messages for future context | Maintains conversation history across sessions |
| **retrieve_memory** | Get relevant context from past conversations | Provides continuity for pharmaceutical discussions |
| **semantic_cache_response** | Cache responses for similar queries | Reduces latency for common drug inquiries |
| **check_semantic_cache** | Check for existing similar responses | Ensures consistency in medication information |
| **hybrid_search** | Advanced document search combining vector and keyword matching | Improves accuracy of pharmaceutical documentation searches |

### Step 3: Testing Memory-Enhanced Agent

Start your agent with the updated configuration:

```bash
# Start the agent builder service with MCP integration
python -m agent_builder.cli serve \
  --config config/agents.yaml \
  --host 0.0.0.0 \
  --port 5000
```

Test the memory capabilities with sequential queries:

1. First query establishes context:
   ```
   "Tell me about the side effects of Allerway 5"
   ```

2. Follow-up query references previous context:
   ```
   "Given those side effects, what precautions should be taken?"
   ```

3. The agent should respond using memory from the previous interaction, demonstrating continuity of conversation.

# �🚀 PHASE 3: VALIDATION & EXPANSION

> **Test, validate and expand your pharmaceutical assistant**

After completing the configuration and deployment of your pharmaceutical sales representative agent, it's essential to thoroughly test its capabilities and plan for future enhancements.

## 🧪 Agent Testing Strategy

### Step 1: Knowledge Testing

Verify the agent can accurately retrieve information from pharmaceutical documentation:

1. **Factual Queries**
   - "What is the active ingredient in Allerway 5?"
   - "What are the contraindications for Cifloc?"
   - "What is the recommended pediatric dosage for Lenap 10mg?"

2. **Contextual Understanding**  
   - "Compare the side effects of Drymed 500 and Cifloc"
   - "Explain when Alnedra should be taken with food versus without"
   - "What safety precautions should be taken with Reegen-D 15000?"

### Step 2: Inventory Intelligence

Test the agent's ability to access structured inventory data:

1. **Basic Inventory Queries**
   - "How many units of Allerway 5 are available across all distribution centers?"
   - "Is Cifloc currently in stock at the Mumbai distribution center?"
   - "What's our current inventory level for Drymed 500?"

2. **Complex Business Logic**
   - "Which distribution center has the highest stock of Lenap 10mg?"
   - "Are we below the reorder threshold for Alnedra in any location?"
   - "What's the total inventory value of antihistamine products?"

## 🔄 Continuous Improvement

### Enhancement Roadmap

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| **Image Recognition** | Allow scanning of product packaging | Medium |
| **Prescription Analysis** | Extract information from prescription images | High |
| **Mobile Integration** | Native mobile app for field representatives | High |
| **Offline Mode** | Limited functionality without internet connection | Medium |
| **Competitor Analysis** | Add comparative product information | Low |

### Deployment Options

1. **Cloud Deployment**
   - Deploy to MongoDB Atlas App Services
   - Configure with AWS/Azure/GCP serverless functions
   - Set up CI/CD pipeline for automated updates

2. **On-Premises Solutions**
   - Kubernetes deployment within corporate infrastructure
   - Integration with existing enterprise systems
   - Compliance with internal security policies

3. **Hybrid Approaches**
   - Keep sensitive data on-premises
   - Use cloud resources for model serving
   - Implement proper data encryption and access controls

## 🔍 Troubleshooting Guide

If you encounter issues during setup or operation, here are some common problems and solutions:

### MongoDB Connection Issues

```
Error: MongoDB connection failed
```

**Solutions:**
- Verify your MongoDB Atlas connection string
- Check if your IP address is whitelisted in MongoDB Atlas
- Ensure your cluster is running and accessible
- Test connection with MongoDB Compass

### Embedding Model Errors

```
Error: Failed to generate embeddings
```

**Solutions:**
- Verify your API keys for VoyageAI or AWS are correct and active
- Check that the embedding model specified exists
- Ensure your network can reach the embedding service
- Try reducing embedding dimensions if you encounter memory issues

### MCP Server Connection Problems

```
Error: Failed to connect to MCP server
```

**Solutions:**
- Verify the MCP server is running with `docker-compose ps`
- Check if the port is correctly exposed and accessible
- Review the MCP server logs with `docker-compose logs memory-mcp`
- Ensure your MongoDB configuration for the MCP server is correct

### Agent Execution Errors

```
Error: Tool execution failed
```

**Solutions:**
- Check if all required environment variables are set
- Verify namespace values match your MongoDB collections
- Review tool permissions and settings
- Test each tool individually to isolate the problem