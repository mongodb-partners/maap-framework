---
sidebar_position: 6
---

# Cohere


## Introduction

[Cohere Inc.](https://cohere.com/) is a Canadian multinational technology firm that concentrates on enterprise artificial intelligence, specializing particularly in large-scale language models.

## Deploying your model
Cohere offers the capability to deploy various Chat Models(LLM) under its umbrella. 

### Chat Model
Refer to their [documentation](https://docs.cohere.com/reference/chat) to understand the latest offerings, with feature and cost comparisons.

#### Usage with MAAP
To use the Cohere chat model with the MAAP framework, you would need to feed the below values.

- #### Config File :
  Provided below are the values required to be added in the `config.yaml` file in the LLM section.
  ```
  llms:
      class_name: Cohere
      model_name: <check_references_below>
      temperature: <integer_value>
  ```

- #### Environment Variable :
  The below value(s) are to be added in the `.env` file, present at `builder/partnerproduct/`.

  ```
  COHERE_API_KEY : <check_references_below>
  ```

### Embedding Model 

Refer to their [documentation](https://docs.cohere.com/reference/embed) to understand the latest offerings, with feature and cost comparisons.

#### Usage with MAAP
To use the Cohere embedding model with the MAAP framework, you would need to feed the below values.

- #### Config File :
  Provided below are the values required to be added in the `config.yaml` file located in the embedding section.
  ```
  embedding:
      class_name: Cohere
      model_name: <check_references_below>
  ```

- #### Environment Variable :
  The below value(s) are to be added in the `.env` file, present at `builder/partnerproduct/`.

  ```
  COHERE_API_KEY = <check_references_below>
  ```

### References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### Model Name
  You can pick any model from the [updated list](https://docs.cohere.com/docs/models) given in Cohere documentation.

- ##### API Key 

  You will need to [sign up](https://dashboard.cohere.com/api-keys) and retrieve a Cohere API Key.
