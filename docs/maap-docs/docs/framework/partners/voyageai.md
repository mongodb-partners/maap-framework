---
sidebar_position: 8
---

# VoyageAI

## Introduction

[Voyage AI](https://www.voyageai.com/) Supercharging Search and Retrieval for Unstructured Data 


### Embedding Model

Refer to their [documentation](https://docs.voyageai.com/docs/embeddings) to understand the latest offerings.

#### Usage with MAAP
To use VoyageAI embedding with MAAP framework, you would need to feed below values.


- #### Config File :
  Provided below are the values required to be added in `config.yaml` file in embedding section.
  ```
  embedding:
      class_name: VoyageAI
      model_name: voyage-3
  ```

- #### Environment Variable :
  Below value(s) are to be added in `.env` file, present at `builder/partnerproduct/`.
  ```
  VOYAGE_AI_API_KEY = <check_references_below>
  ```


### References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### API Key 

  VoyageAI hosts its suite of embedding model as serverless API and they can be accessed using API KEY. You will need to [sign up](https://docs.voyageai.com/docs/api-key-and-installation) and retrieve a VoyageAI API Key.