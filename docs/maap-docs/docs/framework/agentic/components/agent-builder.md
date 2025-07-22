# Agent Builder

A flexible framework for building and deploying LLM agents with various capabilities using LangChain and LangGraph.

## Overview

MAAP Agent Builder is a modular framework that allows you to configure and deploy different types of agents with various capabilities:

- **Multiple Agent Types**: Support for React, Tool-Call, Reflection, Plan-Execute-Replan, and Long-Term Memory agents
- **Diverse LLM Providers**: Integration with Anthropic, Bedrock, Fireworks, Together AI, Cohere, Azure, Ollama, and more
- **Embedding Model Support**: Bedrock, SageMaker, VertexAI, Azure, Together, Fireworks, Cohere, VoyageAI, Ollama, and HuggingFace
- **Tool Integration**: Easy-to-configure tools for extending agent capabilities
- **Stateful Conversations**: Support for conversation history and checkpointing
- **Web API**: Built-in Flask server for easy deployment and interaction

## Installation

Clone the repository and install the required dependencies:

```bash
git clone https://github.com/yourusername/maap-agent-builder.git
cd maap-agent-builder
pip install -e .
```

## Configuration

MAAP Agent Builder is configured through YAML files and environment variables.

### Environment Variables

Create a `.env` file in the root directory with your API keys and configuration:

```
# LLM API Keys
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key
FIREWORKS_API_KEY=your_fireworks_key
TOGETHER_API_KEY=your_together_key
COHERE_API_KEY=your_cohere_key

# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your_azure_key
AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com

# Vector DB Configuration (if using long-term memory agents)
MONGODB_URI=your_mongodb_connection_string

# Application Configuration
LOG_LEVEL=INFO
FLASK_SECRET_KEY=your_flask_secret_key
```

### Agent Configuration (agents.yaml)

Create a YAML configuration file to define your agents, LLMs, embedding models, and tools:

```yaml
# Configure the embedding model
embeddings:
 - name: all-mpnet-v2
   provider: huggingface
   model_name: sentence-transformers/all-mpnet-base-v2
   normalize: true

# Configure the language model
llms:
  - name: fireworks_llm_maverick
    provider: fireworks
    model_name: accounts/fireworks/models/llama4-maverick-instruct-basic
    temperature: 0.7
    max_tokens: 4000
    streaming: False
    additional_kwargs:
      top_p: 0.9
      top_k: 50

# Configure agent tools
tools:
  - name: product_recommender
    tool_type: vector_search
    description: Searches for relevant documents in the vector store
    connection_str: ${MONGODB_URI:-mongodb://localhost:27017}
    namespace: amazon.products
    embedding_model: all-mpnet-v2  # Reference to the embedding model defined above
    additional_kwargs:
      index_name: default
      embedding_field: embedding
      text_field: text
      top_k: 5
      min_score: 0.7

# Configure checkpointing
checkpointer:
  connection_str: ${MONGODB_URI:-mongodb://localhost:27017}
  db_name: agent_state
  collection_name: checkpoints
  name: rag_agent_checkpointer

# Configure the agent
agent:
  name: rag_react_agent
  agent_type: react
  llm: fireworks_llm_maverick  # Reference to the LLM defined above
  tools:
    - product_recommender  # Reference to the tool defined above
  system_prompt_path: ./prompts/rag_system_prompt.txt
```

## Agent Types

MAAP Agent Builder supports several agent types, each with different capabilities:

1. **react**: ReAct agents that think step-by-step and use tools
2. **tool_call**: Agents that use OpenAI-style tool calling
3. **reflect**: Agents that use a generate-reflect loop for improved reasoning
4. **plan_execute_replan**: Agents that plan, execute steps, and replan as needed
5. **long_term_memory**: Agents with vector store-backed long-term memory

### Agent Type-Specific Configuration

Different agent types require different configuration parameters:

#### React Agent
```yaml
agent:
  agent_type: react
  name: react_agent
  llm: gpt4
  system_prompt: "You are a helpful assistant..."
  tools:
    - search_tool
```

#### Reflection Agent
```yaml
agent:
  agent_type: reflect
  name: reflection_agent
  llm: claude
  system_prompt: "You are a helpful assistant..."
  reflection_prompt: "Review your previous response and improve it..."
  tools:
    - calculator
```

#### Plan-Execute-Replan Agent
```yaml
agent:
  agent_type: plan_execute_replan
  name: planner_agent
  llm: gpt4
  system_prompt: "You are a helpful assistant..."
  tools:
    - search_tool
    - calculator
```

#### Long-Term Memory Agent
```yaml
agent:
  agent_type: long_term_memory
  name: memory_agent
  llm: claude
  connection_str: ${MONGODB_URI}
  namespace: agent_db.memories
  tools:
    - search_tool
```

## Running Locally

There are several ways to run the MAAP Agent Builder locally:

### 1. Using the CLI

```bash
# Set the configuration path
export AGENT_CONFIG_PATH=/path/to/your/agents.yaml

# Run the server
python -m mdb_agent_builder.cli serve --config /path/to/your/agents.yaml --port 5000
```

### 2. Using WSGI

```bash
# Set the configuration path
export AGENT_CONFIG_PATH=/path/to/your/agents.yaml

# Run with Gunicorn (recommended for production)
gunicorn -b 0.0.0.0:5000 mdb_agent_builder.wsgi:application
```

### 3. Using Python Directly

```python
from mdb_agent_builder.app import AgentApp

# Create the agent app with your configuration
agent_app = AgentApp('/path/to/your/agents.yaml')

# Run the app
agent_app.run(host='0.0.0.0', port=5000, debug=True)
```

## API Endpoints

Once the server is running, you can interact with your agent through the following endpoints:

- **GET /health**: Health check endpoint
- **POST /chat**: Send a message to the agent
  ```json
  {
    "message": "What is the capital of France?"
  }
  ```
- **POST /reset**: Reset the conversation history

## Example: Curl Commands

```bash
# Health check
curl http://localhost:5000/health

# Send a message to the agent
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the capital of France?"}'

# Reset conversation
curl -X POST http://localhost:5000/reset
```

## Advanced Configuration

### Loading Prompts from Files

Instead of including prompts directly in the YAML, you can load them from files:

```yaml
agent:
  agent_type: react
  name: my_agent
  llm: gpt4
  system_prompt_path: /path/to/system_prompt.txt
  tools:
    - search_tool
```

### Environment Variable Substitution

The configuration supports environment variable substitution with default values:

```yaml
llms:
  - name: openai_llm
    provider: openai
    model_name: ${OPENAI_MODEL_NAME:-gpt-4-turbo}
    temperature: ${TEMPERATURE:-0.7}
```

### MongoDB Checkpointing

For persistent conversations across restarts, configure a MongoDB checkpointer:

```yaml
checkpointer:
  connection_str: ${MONGODB_CONNECTION_STRING}
  db_name: langgraph
  collection_name: checkpoints
```

## Troubleshooting

### Common Issues

1. **Missing API Keys**: Ensure all required API keys are set in your environment variables
2. **Configuration Loading Error**: Check your YAML syntax for errors
3. **LLM Provider Not Found**: Verify that the LLM provider is supported and correctly configured
4. **Tool Execution Failed**: Check that tools have all required parameters

### Logging

Adjust the logging level to get more detailed information:

```bash
export LOG_LEVEL=DEBUG
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.