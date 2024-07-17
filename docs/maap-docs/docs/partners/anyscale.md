---
sidebar_position: 5
---

# Anyscale

## Introduction

[Anyscale](https://anyscale.com/) is a Canadian multinational technology firm that concentrates on enterprise artificial intelligence, specializing particularly in large-scale language models.

## Deploying your model
Anyscale offers the capability to deploy various Chat Models(LLM) under its umbrella. 

### LLM Model 

Refer to their [documentation](https://docs.anyscale.com/) to understand the latest offerings, with feature and cost comparisons.

#### Usage with MAAP
To use Anyscale model with MAAP framework, you would need to feed below values.

- #### Config File :
  Provided below are the values required to be added in `config.yaml` file in embedding section.
  ```
  llms:
      class_name: Anyscale
      model_name: <check_references_below>
  ```

- #### Environment Variable :
  Below value(s) are to be added in `.env` file

  ```
  ANYSCALE_API_KEY = <check_references_below>
  ANYSCALE_BASE_URL= <check_references_below>
  ```

### References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### Model Name
  You can pick any model from the [updated list](https://docs.anyscale.com/1.0.0/endpoints/overview/) given in Anyscale documentation.

- ##### API Key & Base URL

  Follow the steps given in this [guide](https://docs.anyscale.com/1.0.0/endpoints/model-serving/get-started/), to setup your account and get `API Key` and `Base URL` 
