---
sidebar_position: 6
---

# Cohere


## Introduction

[Cohere Inc.](https://cohere.com/) is a Canadian multinational technology firm that concentrates on enterprise artificial intelligence, specializing particularly in large-scale language models.

## Deploying your model
Cohere offers the capability to deploy various Chat Models(LLM) under its umbrella. 

### Embedding Model 

Refer to their [documentation](https://docs.cohere.com/reference/embed) to understand the latest offerings, with feature and cost comparisons.

#### Usage with MAAP
To use Cohere model with MAAP framework, you would need to feed below values.

- #### Config File :
  Provided below are the values required to be added in `config.yaml` file in embedding section.
  ```
  embedding:
      class_name: Cohere
      model_name: <check_references_below>
  ```

- #### Environment Variable :
  Below value(s) are to be added in `.env` file

  ```
  COHERE_API_KEY = <check_references_below>
  ```

### References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### Model Name
  You can pick any model from the [updated list](https://docs.cohere.com/docs/cohere-embed#english-models) given in Cohere documentation.

- ##### API Key 

  You will need to [sign up](https://dashboard.cohere.com/api-keys) and retrieve a Cohere API Key.
