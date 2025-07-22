# MCP Server

Memory-MCP is a MongoDB-based Model Context Protocol (MCP) server that provides intelligent memory management, semantic caching, and hybrid search capabilities for AI applications. The system integrates with AWS Bedrock for embedding generation, MongoDB for data storage, and Tavily for web search functionality.

### Key Features

- **Hybrid Search**: Combines vector similarity and keyword matching for comprehensive search results
- **AI Memory Management**: Stores and retrieves conversational context with intelligent summarization
- **Semantic Caching**: Caches AI responses for similar queries to improve performance
- **Web Search Integration**: External web search capabilities through Tavily API
- **Multi-Service Architecture**: Modular design with separate services for memory, cache, and logging
- **Containerized Deployment**: Docker-based deployment with orchestration support

### Target Audience

- AI application developers requiring persistent memory capabilities
- Organizations building conversational AI systems
- Developers implementing semantic search and caching solutions
- Teams working with MongoDB and AWS Bedrock integration

## 2. System Architecture

The Memory-MCP system follows a microservices architecture with the main MCP server coordinating multiple specialized services:

```mermaid
graph TB
    %% Client Layer
    Client[MCP Client Application]
    
    %% Main Server
    MCP[Memory-MCP Server<br/>:8080<br/>FastMCP + HTTP Transport]
    
    %% Microservices Layer
    subgraph "Containerized Services Network"
        direction TB
        MEM[AI Memory Service<br/>:8182<br/>Conversation Management]
        CACHE[Semantic Cache Service<br/>:8183<br/>Intelligent Caching]
        LOG[Event Logger Service<br/>:8181<br/>Centralized Logging]
    end
    
    %% Core Tools Layer
    subgraph "MCP Tools"
        direction LR
        T1[Memory Tools<br/>store_memory<br/>retrieve_memory]
        T2[Cache Tools<br/>semantic_cache_response<br/>check_semantic_cache]
        T3[Search Tools<br/>hybrid_search<br/>search_web]
    end
    
    %% Data Layer
    subgraph "MongoDB Atlas"
        direction TB
        DB1[Memory Collection<br/>Conversations & Context]
        DB2[Documents Collection<br/>Vector + Full-text Search]
        DB3[Cache Collection<br/>Semantic Query Cache]
    end
    
    %% External Services
    subgraph "AWS Bedrock"
        direction TB
        EMB[Titan Embed Text v1<br/>Vector Embeddings]
        LLM[Claude Sonnet<br/>Text Generation]
    end
    
    subgraph "External APIs"
        TAVILY[Tavily Search API<br/>Web Content Retrieval]
    end
    
    %% Storage & Logging
    subgraph "Local Storage"
        LOGS[Log Files<br/>logs/*.log]
        RESULTS[Test Results<br/>test_results/*.json]
    end
    
    %% Connections with labels
    Client -.->|MCP Protocol<br/>HTTP Transport| MCP
    
    MCP --> T1
    MCP --> T2  
    MCP --> T3
    
    T1 -.->|HTTP API| MEM
    T2 -.->|HTTP API| CACHE
    
    T3 -.->|Direct Connection| DB2
    T3 -.->|Embedding Generation| EMB
    T3 -.->|Web Search| TAVILY
    
    MEM -.->|Store/Retrieve<br/>Conversations| DB1
    MEM -.->|Context Summarization| LLM
    MEM -.->|Similarity Search| EMB
    
    CACHE -.->|Cache Operations| DB3
    CACHE -.->|Query Embeddings| EMB
    
    LOG -.->|Write Logs| LOGS
    
    %% All services log to central logger
    MCP -.->|Application Events| LOG
    MEM -.->|Memory Events| LOG
    CACHE -.->|Cache Events| LOG
    
    %% Testing connections
    MCP -.->|Test Results| RESULTS
    
    %% Styling
    classDef client fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef server fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef service fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef tool fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef database fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef external fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    classDef storage fill:#fff8e1,stroke:#f57f17,stroke-width:2px
    
    class Client client
    class MCP server
    class MEM,CACHE,LOG service
    class T1,T2,T3 tool
    class DB1,DB2,DB3 database
    class EMB,LLM,TAVILY external
    class LOGS,RESULTS storage
```

The architecture supports horizontal scaling through Docker containers and network isolation through a dedicated bridge network. The system processes requests through the FastMCP framework, which handles tool registration and HTTP transport.

## 3. Components

### 3.1 Memory-MCP Server (Main Component)

**Purpose**: Central orchestration server that exposes MCP tools and coordinates with other services.

**Technologies Used**:
- FastMCP framework for MCP protocol implementation
- Docker containerization with Python 3.12
- uv for dependency management
- HTTPx for asynchronous HTTP client operations

**Core Functionality**:
- Tool registration and management
- Request routing to appropriate services
- Response aggregation and formatting
- Error handling and logging coordination

**Interactions**: Communicates with all other components through HTTP APIs and database connections.

### 3.2 AI Memory Service

**Purpose**: Manages conversational memory storage, retrieval, and context summarization.

**Key Features**:
- Conversation history management
- Semantic similarity search for relevant memories
- Context summarization using AI models
- User-specific memory isolation

**Integration Points**:
- MongoDB for persistent storage
- AWS Bedrock for embedding generation
- Event logging for audit trails

### 3.3 Semantic Cache Service

**Purpose**: Implements intelligent caching based on semantic similarity rather than exact matches.

**Key Features**:
- Query similarity detection
- Response caching with TTL management
- Cache hit optimization
- User-specific cache namespacing

**Performance Benefits**:
- Reduced API calls to expensive AI services
- Improved response times for similar queries
- Cost optimization through intelligent caching

### 3.4 Event Logger Service

**Purpose**: Centralized logging and monitoring for all system events.

**Capabilities**:
- Structured logging with metadata
- Async and sync logging support
- Log retention management
- Service health monitoring

### 3.5 MongoDB Service Integration

**Purpose**: Provides database connectivity and operations for all data persistence needs.

**Features**:
- Connection pooling and management
- Aggregation pipeline support
- Vector search capabilities
- Full-text search integration

### 3.6 AWS Bedrock Integration

**Purpose**: Handles AI model interactions for embeddings and text generation.

**Models Supported**:
- Amazon Titan Embed Text v1 for embeddings
- Anthropic Claude for text generation
- Configurable model selection

### 3.7 External Services

**Tavily Web Search**: Provides external web search capabilities with content extraction and summarization.

## 4. Installation & Deployment

### 4.1 Prerequisites

**Software Requirements**:
- Docker and Docker Compose
- Python 3.12+ (for local development)
- MongoDB Atlas account or local MongoDB instance
- AWS account with Bedrock access
- Tavily API key for web search

**Hardware Requirements**:
- Minimum 2GB RAM
- 1GB available disk space
- Network connectivity for external services

### 4.2 Environment Setup

Create the required environment files:

Copy `.env.<service_name>.example` to `.env.<service_name>` file.

### 4.3 Docker Deployment

**Using Docker Compose** (Recommended):

```bash
# Clone and navigate to project directory
git clone <repository-url>
cd memory-mcp

# Build and start all services
docker-compose up -d

# Verify deployment
docker-compose ps
docker-compose logs memory-mcp
```

### 4.4 Local Development Setup

```bash
# Install uv package manager
curl -LsSf https://astral.sh/uv/install.sh | sh

# Sync dependencies
uv sync

# Run development server
uv run src/server.py
```

## 5. Configuration

### 5.1 Environment Variables

**Core Application Settings**:
```bash
APP_NAME=memory-mcp                                    # Application identifier
DEBUG=False                                            # Debug mode toggle
PORT=8080                                             # Server port
```

**Service URLs**:
```bash
LOGGER_SERVICE_URL=http://event-logger:8181           # Event logging service
AI_MEMORY_SERVICE_URL=http://ai-memory:8182          # Memory management service
SEMANTIC_CACHE_SERVICE_URL=http://semantic-cache:8183 # Semantic caching service
```

**AWS Configuration**:
```bash
AWS_ACCESS_KEY_ID=your_access_key                     # AWS access credentials
AWS_SECRET_ACCESS_KEY=your_secret_key                 # AWS secret key
AWS_REGION=us-east-1                                  # AWS region
EMBEDDING_MODEL_ID=amazon.titan-embed-text-v1        # Bedrock embedding model
LLM_MODEL_ID=us.anthropic.claude-sonnet-4-20250514-v1:0 # Language model
VECTOR_DIMENSION=1536                                 # Embedding vector dimension
```

**External APIs**:
```bash
TAVILY_API_KEY=your_tavily_api_key                    # Web search API key
```

### 5.2 MongoDB Configuration

**Connection String Format**:
```
mongodb+srv://username:password@cluster.mongodb.net/database_name
```

**Required Collections**:
- `documents`: For hybrid search functionality
- `memory`: For conversational memory storage
- `cache`: For semantic caching

**Index Requirements**:
- Vector search index: `documents_vector_search_index` on `embedding` field
- Text search index: `text` for full-text search capabilities

### 5.3 Docker Compose Configuration

The `docker-compose.yml` file orchestrates multiple services:

```yaml
services:
  memory-mcp:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - event-logger
      - ai-memory
      - semantic-cache
    networks:
      - mcp-network

networks:
  mcp-network:
    driver: bridge
```

## 6. Usage

### 6.1 Server Startup

Start the MCP server using Docker Compose:

```bash
docker-compose up -d
```

The server will be available at `http://localhost:8080/mcp` for MCP protocol connections.

### 6.2 Client Connection

Connect to the MCP server using the FastMCP client:

```python
from fastmcp import Client
import asyncio

async def connect_to_server():
    async with Client("http://localhost:8080/mcp") as client:
        # List available tools
        tools = await client.list_tools()
        print(f"Available tools: {[tool.name for tool in tools]}")
        
        # Use a tool
        result = await client.call_tool("hybrid_search", {
            "connection_string": "mongodb+srv://...",
            "database_name": "your_database",
            "collection_name": "documents",
            "query": "your search query",
            "user_id": "user@example.com"
        })

asyncio.run(connect_to_server())
```

### 6.3 Common Usage Patterns

**Memory Management Workflow**:
1. Store conversation messages using `store_memory`
2. Retrieve relevant context using `retrieve_memory`
3. Cache AI responses using `semantic_cache_response`
4. Check cache before generating new responses using `check_semantic_cache`

**Search Workflow**:
1. Use `hybrid_search` for database queries combining semantic and keyword search
2. Use `search_web` for external information gathering
3. Weight search results based on use case requirements

## 7. API Reference

### 7.1 Memory Tools

#### store_memory

**Description**: Store a message in AI memory system.

**Parameters**:
- `conversation_id` (string): Unique conversation identifier
- `text` (string): Message content to store
- `message_type` (string): Type of message ("human" or "ai")
- `user_id` (string): User identifier for isolation
- `timestamp` (string, optional): ISO format timestamp

**Returns**: Dictionary with storage confirmation and metadata.

**Example**:
```python
result = await client.call_tool("store_memory", {
    "conversation_id": "conv_123",
    "text": "I'm interested in F1 racing at Marina Bay.",
    "message_type": "human",
    "user_id": "user@example.com",
    "timestamp": "2025-01-09T10:30:00Z"
})
```

#### retrieve_memory

**Description**: Get relevant AI memory with context and summary.

**Parameters**:
- `user_id` (string): User identifier
- `text` (string): Query text for memory retrieval

**Returns**: Dictionary containing:
- `related_conversation`: Relevant conversation history
- `conversation_summary`: AI-generated summary of context
- `similar_memories`: Related memories from user's history

**Example**:
```python
result = await client.call_tool("retrieve_memory", {
    "user_id": "user@example.com",
    "text": "Tell me about F1 racing experiences"
})
```

### 7.2 Cache Tools

#### semantic_cache_response

**Description**: Cache AI response for similar queries.

**Parameters**:
- `user_id` (string): User identifier
- `query` (string): Original query text
- `response` (string): AI response to cache
- `timestamp` (string, optional): ISO format timestamp

**Returns**: Dictionary with cache storage confirmation.

#### check_semantic_cache

**Description**: Get cached response for similar query.

**Parameters**:
- `user_id` (string): User identifier
- `query` (string): Query text to search in cache

**Returns**: Dictionary with cached response if found, empty if no match.

### 7.3 Search Tools

#### hybrid_search

**Description**: Advanced hybrid search combining vector similarity and keyword matching.

**Parameters**:
- `connection_string` (string): MongoDB connection string
- `database_name` (string): Database name
- `collection_name` (string): Collection name
- `fulltext_search_field` (string): Field for text search
- `vector_search_index_name` (string): Vector search index name
- `vector_search_field` (string): Field containing embeddings
- `query` (string): Search query
- `user_id` (string): User identifier for filtering
- `weight` (float, default: 0.5): Balance between vector (1.0) and text (0.0) search
- `limit` (int, default: 10): Maximum number of results

**Returns**: Dictionary with `results` array containing scored documents.

**Example**:
```python
result = await client.call_tool("hybrid_search", {
    "connection_string": "mongodb+srv://...",
    "database_name": "my_database",
    "collection_name": "documents",
    "fulltext_search_field": "text",
    "vector_search_index_name": "documents_vector_search_index",
    "vector_search_field": "embedding",
    "query": "Marina Bay F1 racing experience",
    "user_id": "user@example.com",
    "weight": 0.7,
    "limit": 5
})
```

#### search_web

**Description**: Search web using Tavily API.

**Parameters**:
- `query` (string): Web search query

**Returns**: List of strings containing web search results.

**Example**:
```python
result = await client.call_tool("search_web", {
    "query": "Marina Bay Sands F1 circuit Singapore"
})
```

## 8. Security Considerations

### 8.1 Authentication and Authorization

**User Isolation**: The system implements user-based isolation through `user_id` parameters, ensuring users can only access their own data.

**API Key Management**:
- Store AWS credentials securely using environment variables
- Rotate API keys regularly
- Use IAM roles for production deployments when possible

**Network Security**:
- Use Docker networks to isolate services
- Implement HTTPS for production deployments
- Restrict database access to specific IP ranges

### 8.2 Data Encryption

**At Rest**:
- MongoDB Atlas provides encryption at rest
- Use encrypted storage volumes for Docker containers

**In Transit**:
- Use TLS for all external API communications
- Implement HTTPS for the MCP server endpoint

### 8.3 Input Validation

The system implements comprehensive input validation:
- User ID format validation
- Message type validation (human/ai only)
- Query parameter sanitization
- MongoDB injection prevention

### 8.4 Known Vulnerabilities and Mitigations

**Dependency Management**:
- Regular updates of Python dependencies
- Vulnerability scanning with `pip audit`
- Use of pinned dependency versions in requirements.txt

**Database Security**:
- Use of prepared statements and parameterized queries
- MongoDB connection string encryption
- Regular security updates for MongoDB driver

## 9. Monitoring & Logging

### 9.1 Key Metrics

**Performance Metrics**:
- Tool execution time
- Database query response time
- API call success rates
- Memory usage and cache hit rates

**Business Metrics**:
- Number of conversations stored
- Search query volume
- Cache effectiveness
- User activity patterns

### 9.2 Event Logger Service

The integrated event logger provides:
- Structured logging with metadata
- Real-time log streaming
- Log retention management
- Service health monitoring

**Log Levels**:
- `DEBUG`: Detailed execution information
- `INFO`: General operational events
- `WARNING`: Potential issues
- `ERROR`: Error conditions requiring attention

### 9.3 Log Management

**Local Logging**:
- File-based logging in the `logs/` directory
- Automatic log rotation and cleanup
- Console output for development

**Remote Logging**:
- Centralized logging through event logger service
- Structured JSON format for log analysis
- Async logging to prevent performance impact

**Log Analysis**:
```bash
# View recent logs
docker-compose logs -f memory-mcp

# Check specific service logs
docker-compose logs ai-memory

# Monitor real-time events
tail -f logs/memory-mcp.log
```

## 10. Troubleshooting

### 10.1 Common Issues

**Connection Errors**:

*Issue*: `Failed to connect to MongoDB`
```
Solution:
- Verify MongoDB connection string format
- Check network connectivity
- Ensure client IP is whitelisted in MongoDB Atlas
- Validate credentials
```

*Issue*: `Service unavailable` for dependent services
```
Solution:
- Check Docker container status: docker-compose ps
- Restart services: docker-compose restart
- Verify network configuration
- Check service health endpoints
```

**Tool Execution Errors**:

*Issue*: `Invalid user_id` error
```
Solution:
- Ensure user_id is provided and non-null
- Use valid email format for user identification
- Check input validation in client code
```

*Issue*: `Invalid message_type` error
```
Solution:
- Use only "human" or "ai" for message_type parameter
- Check case sensitivity in parameter values
- Validate input before tool calls
```

### 10.2 Debugging Steps

**1. Check Service Health**:
```bash
# Verify all containers are running
docker-compose ps

# Check service logs
docker-compose logs memory-mcp
docker-compose logs ai-memory
docker-compose logs semantic-cache
docker-compose logs event-logger
```

**2. Test Individual Components**:
```bash
# Test MCP server endpoint
curl http://localhost:8080/health

# Test database connectivity
python -c "import pymongo; client = pymongo.MongoClient('your_connection_string'); print(client.admin.command('ping'))"

# Test AWS Bedrock access
aws bedrock-runtime invoke-model --region us-east-1 --model-id amazon.titan-embed-text-v1 --body '{"inputText":"test"}' response.json
```

**3. Validate Configuration**:
```bash
# Check environment variables
docker-compose exec memory-mcp env | grep -E "(AWS|TAVILY|MONGO)"

# Verify network connectivity
docker-compose exec memory-mcp ping ai-memory
docker-compose exec memory-mcp ping semantic-cache
```

### 10.3 Performance Issues

**Slow Query Performance**:
- Check MongoDB indexes are properly created
- Monitor query execution plans
- Optimize search parameters and limits
- Consider database scaling options

**High Memory Usage**:
- Monitor container resource usage
- Implement result pagination
- Optimize embedding vector dimensions
- Check for memory leaks in long-running processes

### 10.4 Error Messages and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `ConnectionFailure` | MongoDB connection issues | Check connection string, network, credentials |
| `ToolError` | Invalid tool parameters | Validate input parameters against API reference |
| `HTTPStatusError` | Service communication failure | Check service health, restart if needed |
| `ClientError` | AWS Bedrock issues | Verify AWS credentials and region settings |
| `TimeoutError` | Service response timeout | Increase timeout values, check service performance |

## 11. Development Guide

### 11.1 Codebase Organization

```
memory-mcp/
├── src/
│   ├── server.py              # Main MCP server entry point
│   └── core/
│       ├── config.py          # Configuration management
│       └── logger.py          # Logging utilities
├── tools/                     # MCP tool implementations
│   ├── search_tools.py        # Search-related tools
│   ├── memory_tools.py        # Memory management tools
│   └── cache_tools.py         # Caching tools
├── services/                  # External service integrations
│   ├── mongodb_service.py     # MongoDB operations
│   ├── bedrock_service.py     # AWS Bedrock integration
│   └── external/
│       └── tavily_service.py  # Tavily web search
├── utils/                     # Utility functions
│   ├── validators.py          # Input validation
│   └── serializers.py         # Data serialization
├── tests/                     # Test suite
│   └── test_memory_mcp.py     # Comprehensive tests
├── client/                    # Client examples
│   └── memory-mcp-client.py   # Test client
└── docker-compose.yml         # Service orchestration
```

### 11.2 Development Environment Setup

**Prerequisites**:
- Python 3.12+
- uv package manager
- Docker for integration testing

**Setup Steps**:
```bash
# Clone repository
git clone <repository-url>
cd memory-mcp

# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
uv sync

# Set up pre-commit hooks (optional)
pre-commit install

# Run development server
uv run src/server.py
```

### 11.3 Testing Procedures

**Comprehensive Test Suite**:
The project includes a comprehensive test suite (`tests/test_memory_mcp.py`) that covers:
- Tool functionality testing
- Error handling validation
- Performance and concurrency testing
- Integration testing with external services

**Running Tests**:
```bash
# Run full test suite
pytest tests/ -v

# Run specific test
pytest tests/test_memory_mcp.py::test_hybrid_search -v

# Run with coverage
pytest tests/ --cov=src --cov-report=html

# Run performance tests
pytest tests/ -m performance
```

**Test Results**:
The test suite automatically generates detailed reports:
- JSON results file: `test_results/mcp_test_results_TIMESTAMP.json`
- Summary report: `test_results/mcp_test_summary_TIMESTAMP.txt`

**Example Test Execution**:
```bash
# Start services for testing
docker-compose up -d

# Wait for services to be ready
sleep 30

# Run tests
python tests/test_memory_mcp.py

# Or use pytest
pytest tests/ -v -s
```

### 11.4 Adding New Tools

**Tool Registration Process**:

1. **Create Tool Function**: Implement the tool in appropriate module (e.g., `tools/new_tools.py`)
```python
def register_new_tools(mcp: FastMCP):
    @mcp.tool(name="new_tool", description="Tool description")
    async def new_tool(param1: str, param2: int) -> Dict[str, Any]:
        # Implementation
        return {"result": "success"}
```

2. **Register in Server**: Add registration to `src/server.py`
```python
from tools.new_tools import register_new_tools
register_new_tools(mcp)
```

3. **Add Tests**: Create test cases in `tests/test_memory_mcp.py`
```python
@pytest.mark.asyncio
async def test_new_tool(mcp_client, test_config):
    result = await mcp_client.call_tool("new_tool", {
        "param1": "test_value",
        "param2": 42
    })
    # Assertions
```

4. **Update Documentation**: Add tool documentation to API Reference section

### 11.5 Code Style and Guidelines

**Code Formatting**:
- Use Black for code formatting: `black src/ tools/ services/`
- Follow PEP 8 style guidelines
- Use type hints for all function parameters and return values

**Error Handling**:
- Use try-catch blocks for external service calls
- Log errors with appropriate context
- Return structured error responses

**Async Programming**:
- Use async/await for I/O operations
- Avoid blocking operations in async functions
- Use asyncio.gather() for concurrent operations

## 12. Maintenance & Operations

### 12.1 Scheduled Maintenance Tasks

**Daily Tasks**:
- Monitor service health and logs
- Check Error rates and performance metrics
- Verify backup completion status

**Weekly Tasks**:
- Review and rotate log files
- Update dependencies with security patches
- Performance optimization review

**Monthly Tasks**:
- Full system backup verification
- Security audit and vulnerability scanning
- Capacity planning and scaling decisions

### 12.2 Backup Procedures

**MongoDB Backup**:
```bash
# Create database backup
mongodump --uri="mongodb+srv://..." --out=backup_$(date +%Y%m%d)

# Restore from backup
mongorestore --uri="mongodb+srv://..." backup_YYYYMMDD/
```

**Configuration Backup**:
```bash
# Backup environment configuration
tar -czf config_backup_$(date +%Y%m%d).tar.gz environment/ .env docker-compose.yml

# Backup application code
git archive --format=tar.gz HEAD > app_backup_$(date +%Y%m%d).tar.gz
```

### 12.3 Updates and Patches

**Dependency Updates**:
```bash
# Check for updates
uv sync --upgrade

# Update specific package
uv add "package@latest"

# Security updates
uv audit
```

**Container Updates**:
```bash
# Pull latest base images
docker-compose pull

# Rebuild with updates
docker-compose build --no-cache

# Rolling update
docker-compose up -d --no-deps memory-mcp
```

### 12.4 Performance Optimization

**Database Optimization**:
- Monitor index usage and performance
- Optimize aggregation pipelines
- Implement connection pooling
- Regular database maintenance tasks

**Application Optimization**:
- Profile memory usage and optimize
- Cache frequently accessed data
- Implement request rate limiting
- Monitor and tune timeout values

**Infrastructure Scaling**:
- Horizontal scaling through container replication
- Load balancing for high availability
- Resource monitoring and auto-scaling
- Database sharding for large datasets