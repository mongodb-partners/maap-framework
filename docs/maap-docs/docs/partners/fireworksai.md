---
sidebar_position: 7
---

# Fireworks AI

## Introduction

[Fireworks AI](https://fireworks.ai/) offers a rapid, cost-effective, and adaptable solution for generative artificial intelligence, enabling product developers to execute, refine, and distribute LLMs efficiently.


## Deploying your model
Fireworks offers the capability to deploy various Chat Models(LLM) under its umbrella. 

### Chat Model 

Refer to their [documentation](https://fireworks.ai/models) to understand the latest offerings, with feature and cost comparisons.

#### Usage with MAAP
To use Fireworks model with MAAP framework, you would need to feed below values.

- #### Config File :
  Provided below are the values required to be added in `config.yaml` file in embedding section.
  ```
  llms:
      class_name: Fireworks
      model_name: <check_references_below>
      max_tokens: <integer_value>
      temperature: <integer_value>
  ```

- #### Environment Variable :
  _NOTE: Rename the file located at `builder/parterproduct/example.env` to `.env` file._ 
  
  Below value(s) are to be added in `.env` file, present at `builder/partnerproduct/`.

  ```
  FIREWORKS_API_KEY : <check_references_below>
  ```


### Embedding Model

You can follow the same steps as above to deploy the embedding model as well. The process is documented [here](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource).


#### Usage with MAAP
To use Azure OpenAI embedding with MAAP framework, you would need to feed below values.


- #### Config File :
  Provided below are the values required to be added in `config.yaml` file in embedding section. 
  The `class_name` should be appropriate to the embedding model being used.
  ```
  embedding:
      class_name: Fireworks
      model_name: <check_references_below> 
  ```

- #### Environment Variable :
  _NOTE: Rename the file located at `builder/parterproduct/example.env` to `.env` file._ 
  
  Below value(s) are to be added in `.env` file, present at `builder/partnerproduct/`.

  ```
  FIREWORKS_API_KEY = <check_references_below>
  ```


### References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### Model Name
  You can pick any model from the [updated list](https://docs.fireworks.ai/guides/querying-embeddings-models#list-of-available-models) given in Fireworks documentation.

- ##### API Key 

  You will need to [sign up](https://readme.fireworks.ai/docs/quickstart) and retrieve a Fireworks API Key.