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
  embedding:
      class_name: Fireworks
      model_name: <check_references_below>
  ```

- #### Environment Variable :
  Below value(s) are to be added in `.env` file

  ```
  FIREWORKS_API_KEY : <check_references_below>
  ```


### Embedding Model

You can follow the same steps as above to delploy the embedding model as well. The process is documented [here](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/create-resource).


#### Usage with MAAP
To use Azure OpenAI embedding with MAAP framework, you would need to feed below values.


- #### Config File :
  Provided below are the values required to be added in `config.yaml` file in embedding section.
  ```
  embedding:
      class_name: Nomic-v1.5 or Nomic-v1
      model_name: <check_references_below> 
  ```

- #### Environment Variable :
  Below value(s) are to be added in .env file

  ```
  FIREWORKS_API_KEY : <check_references_below>
  ```


### References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### Model Name
  You can pick any model from the [updated list](https://docs.Fireworks.com/docs/Fireworks-embed#english-models) given in Fireworks documentation.

- ##### API Key 

  You will need to [sign up](https://readme.fireworks.ai/docs/quickstart) and retrieve a Fireworks API Key.
