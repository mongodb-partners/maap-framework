---
sidebar_position: 11
---

# OpenAI


## Introduction

[OpenAI](https://openai.com/) is a leading AI research and deployment company dedicated to ensuring artificial general intelligence (AGI) benefits all of humanity. It provides state-of-the-art AI models, APIs, and tools for developers and organizations to build intelligent applications.

## Deploying your model
OpenAI offers the capability to deploy various Chat Models (LLMs) and Embedding Models under its umbrella.

### Chat Model
Refer to their [documentation](https://platform.openai.com/docs/models) to understand the latest offerings, with feature and cost comparisons.

#### Usage with MAAP
To use the OpenAI chat model with the MAAP framework, you would need to feed the below values.

- #### Config File :
  Provided below are the values required to be added in the `config.yaml` file in the LLM section.
  ```
  llms:
      class_name: OpenAI
      model_name: <check_references_below>
      temperature: <integer_value>
  ```

- #### Environment Variable :
  The below value(s) are to be added in the `.env` file, present at `builder/partnerproduct/`.

  ```
  OPENAI_API_KEY = <check_references_below>
  ```
  
## Deploying your model using the LlamaIndex framework
MAAP now provides the option to choose if you want to use LlamaIndex as your main framework to deploy your LLM models.
This can be done by adding the 'framework' configuration to the config.yaml file

  ```
  llms:
    class_name: OpenAI
    model_name: <check_references_below>
    temperature: <integer_value>
    framework: 'llamaindex'
  ```

### References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### Model Name
  You can pick any model from the [updated list](https://platform.openai.com/docs/models) given in the OpenAI documentation.

- ##### API Key

  You will need to [sign up](https://platform.openai.com/signup) and retrieve an OpenAI API Key.
