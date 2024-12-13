---
sidebar_position: 10
---

# TogetherAI


## Introduction

[TogetherAI](https://www.together.ai/) is a platform for open-source AI collaboration, offering tools to build, train, and deploy AI models while fostering community-driven innovation.

## Deploying your model
TogetherAI offers the capability to deploy various Chat Models(LLM) under its umbrella.

### Chat Model
Refer to their [documentation](https://docs.together.ai/docs/chat-overview) to understand the latest offerings, with feature and cost comparisons.

#### Usage with MAAP
To use the TogetherAI chat model with the MAAP framework, you would need to feed the below values.

- #### Config File :
  Provided below are the values required to be added in the `config.yaml` file in the LLM section.
  ```
  llms:
      class_name: TogetherAI
      model_name: <check_references_below>
      temperature: <integer_value>
  ```

- #### Environment Variable :
  The below value(s) are to be added in the `.env` file, present at `builder/partnerproduct/`.

  ```
  TOGETHER_AI_API_KEY : <check_references_below>
  ```

### Embedding Model

Refer to their [documentation](https://docs.together.ai/docs/embeddings-overview) to understand the latest offerings, with feature and cost comparisons.

#### Usage with MAAP
To use the TogetherAI embedding model with the MAAP framework, you would need to feed the below values.

- #### Config File :
  Provided below are the values required to be added in the `config.yaml` file located in the embedding section.
  ```
  embedding:
      class_name: TogetherAI
      model_name: <check_references_below>
  ```

- #### Environment Variable :
  The below value(s) are to be added in the `.env` file, present at `builder/partnerproduct/`.

  ```
  TOGETHER_AI_API_KEY = <check_references_below>
  ```

## Deploying your model using the LlamaIndex framework

### Chat Model

MAAP now provides the option to choose if you want to use LlamaIndex as your main framework to deploy your LLM models.

This can be done by adding the 'framework' configuration to the config.yaml file
- #### Config File
  ```
  llms:
    class_name: TogetherAI
    model_name: <check_references_below>
    framework: 'llamaindex'
  ```

### Embedding Model

MAAP now provides the option to choose if you want to use LlamaIndex as your main framework to deploy your embeddings.

This can be done by adding the 'framework' configuration to the config.yaml file
- #### Config File
  ```
  embedding:
    class_name: TogetherAI
    model_name: <check_references_below>
    framework: 'LlamaIndex'
  ```

## References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### Model Name
  You can pick any model from the [updated list](https://docs.together.ai/docs/serverless-models) given in the TogetherAI documentation.

- ##### API Key

  You will need to [sign up](https://api.together.xyz/settings/api-keys) and retrieve a TogetherAI API Key.
