# NVIDIA

## Introduction

NVIDIA Inference Microservices ([NIM](https://www.nvidia.com/en-us/ai-data-science/products/nim-microservices/)) is a collection of microservices that enables the deployment and serving of foundation models optimized for NVIDIA's accelerated computing platform. NVIDIA NIM provides efficient, production-ready AI model serving capabilities with excellent performance and compatibility with NVIDIA's hardware and software stack.

NVIDIA NIM allows for simplified deployment of a wide range of foundation models, including large language models (LLMs), multimodal models, and embedding models. These models are optimized to leverage NVIDIA's GPU acceleration, enabling high throughput and low latency in production environments.

With NVIDIA NIM, users can access high-quality models through a standardized API interface that simplifies integration with existing systems and applications. The platform offers both cloud-based and on-premise deployment options, providing flexibility to meet various deployment requirements.

## Deploying your model

NVIDIA offers a variety of foundation models through the NIM platform, allowing you to select the most appropriate model for your specific use case.

### LLM Model

To access NVIDIA's NIM models, you'll need to set up your account and obtain the necessary API credentials. Visit the [NVIDIA AI Enterprise](https://www.nvidia.com/en-us/data-center/products/ai-enterprise/) page to get started.

#### Usage with MAAP

To use NVIDIA NIM models with the MAAP framework, you need to configure the following components:

- #### Config File:
  Add the following values to your `config.yaml` file in the LLM section:
  ```
  llms:
      class_name: Nvidia
      model_name: <check_references_below>
      max_tokens: <integer_value> [Optional]
      temperature: <float_value> [Optional]
      top_p: <float_value> [Optional]
      frequency_penalty: <float_value> [Optional]
      presence_penalty: <float_value> [Optional]
  ```

- #### Environment Variables:
  Add the following values to your `.env` file in the `builder/partnerproduct/` directory:
  ```
  NVIDIA_API_KEY=<your_nvidia_api_key>
  NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
  ```

### Embedding Model

NVIDIA provides powerful embedding models that can be used with the MAAP framework for vector representations of text.

#### Usage with MAAP

To use NVIDIA embeddings with the MAAP framework, configure your system as follows:

- #### Config File:
  Add the following values to your `config.yaml` file in the embedding section:
  ```
  embedding:
      class_name: Nvidia
      model_name: <check_references_below>
      truncate: "NONE" [Optional]
      encoding_format: "float" [Optional]
      input_type: "query" # or "passage" depending on your use case [Optional]
  ```


- #### Environment Variables:
  Use the same environment variables as for the LLM model:
  ```
  NVIDIA_API_KEY=<your_nvidia_api_key>
  NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
  ```

### References

Here's information on how to find the correct values for your MAAP framework:

- ##### Model Name
  NVIDIA offers several models through NIM. Common models include:
  - `nvidia/llama-3.1-nemotron-70b-instruct` - High performance instruction-tuned LLM for general tasks
  - `nvidia/llama-3.2-nv-embedqa-1b-v2` - Embedding model optimized for retrieval tasks (2048 dimensions)
  - `nvidia/nv-embed-v1` - General purpose embedding model (4096 dimensions)
  - `nvidia/nv-embedqa-e5-v5` - Embedding model for question-answering (1024 dimensions)

  For a complete list of available models, consult the [NVIDIA NIM documentation](https://www.nvidia.com/en-us/ai-data-science/products/nim-microservices/).

- ##### NVIDIA_API_KEY
  You can obtain your API key by registering for NVIDIA AI Enterprise and accessing the NIM platform. Follow the instructions on the [NVIDIA AI Enterprise](https://www.nvidia.com/en-us/data-center/products/ai-enterprise/) site.

- ##### NVIDIA_BASE_URL
  The default base URL is `https://integrate.api.nvidia.com/v1`. This may change based on your deployment options or region.