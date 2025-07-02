---
sidebar_position: 8
---

# VoyageAI

## Introduction

[Voyage AI](https://www.voyageai.com/) is a cutting-edge solution designed to supercharge search and retrieval for unstructured data, leveraging advanced embedding models. It enables organizations to extract meaningful insights and improve data accessibility through state-of-the-art machine learning techniques.

### Embedding Model

VoyageAI provides robust embedding models that are optimized for handling diverse datasets. These models are designed to deliver high accuracy and performance, making them ideal for applications such as semantic search, recommendation systems, and natural language understanding.

For the latest offerings and updates, refer to the official [VoyageAI Embedding Documentation](https://docs.voyageai.com/docs/embeddings).

#### Usage with MAAP Framework

To integrate VoyageAI embeddings with the MAAP framework, follow the steps below:

- #### Config File:
  Add the following configuration to the `config.yaml` file under the embedding section:
  ```yaml
  embedding:
      class_name: VoyageAI
      model_name: voyage-3
  ```
  This configuration specifies the embedding class and the model version to be used within the MAAP framework.

- #### Environment Variable:
  Include the following environment variable in the `.env` file located at `builder/partnerproduct/`:
  ```env
  VOYAGE_AI_API_KEY=<your_api_key_here>
  ```
  The API key is essential for authenticating requests to the VoyageAI embedding service.

### References

Follow the instructions below to obtain the necessary values for configuring the MAAP framework:

- ##### API Key:
  VoyageAI provides its embedding models as serverless APIs, accessible via an API key. To obtain your API key:
  1. [Sign up](https://docs.voyageai.com/docs/api-key-and-installation) on the VoyageAI platform.
  2. Retrieve your unique VoyageAI API key from the dashboard.

For further details, consult the [VoyageAI API Key and Installation Guide](https://docs.voyageai.com/docs/api-key-and-installation).

- ##### Model Selection:
  VoyageAI offers multiple embedding models tailored for different use cases. Ensure you select the model that best fits your application's requirements. Refer to the [VoyageAI Model Documentation](https://docs.voyageai.com/docs/models) for guidance on choosing the appropriate model.

- ##### Integration Best Practices:
  When integrating VoyageAI with the MAAP framework:
  - Ensure that the API key is securely stored and not hardcoded in the source code.
  - Regularly update the `config.yaml` file to reflect any changes in the embedding model or configuration.
  - Test the integration in a staging environment before deploying to production.

By following these steps, you can seamlessly leverage VoyageAI's capabilities within the MAAP framework to enhance your application's performance and scalability.