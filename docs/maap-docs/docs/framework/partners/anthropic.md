---
sidebar_position: 4
---

# Anthropic

## Introduction

[Anthropic](https://www.anthropic.com/) is a San Francisco-based company specializing in AI safety and research. 

## Deploying your model
Anthropic offers a family of three state-of-the-art models in ascending order of capability: Claude 3 Haiku, Claude 3 Sonnet, and Claude 3 Opus.

### LLM Model 

Refer to their [documentation](https://docs.anthropic.com/en/docs/about-claude/models) to understand the latest offerings, with feature and cost comparisons.

#### Usage with MAAP
To use Anthropic model with MAAP framework, you would need to feed below values.

- #### Config File :
  Provided below are the values required to be added in `config.yaml` file in LLM section.
  ```
  llms:
      class_name: Anthropic
      model_name: <check_references_below>
      max_tokens: <integer_value>
      temperature: <integer_value>

  ```

- #### Environment Variable :
  Below value(s) are to be added in `.env` file, present at `builder/partnerproduct/`.

  ```
  ANTHROPIC_API_KEY = <check_references_below>
  ```

## Deploying your model using the LlamaIndex framework

### LLM Model

Refer to the [Llama Documentation](https://legacy.ts.llamaindex.ai/api/classes/Anthropic#chat) to see the models
offerings. 

#### Usage with MAAP

- #### Config File :
  Provided below are the values required to be added in `config.yaml` file in LLM section.
  ```
  llms:
      class_name: Anthropic
      model_name: <check_references_below>
      framework: 'llamaindex'
      max_tokens: <integer_value>
      temperature: <integer_value>

  ```

- #### Environment Variable :
  Below value(s) are to be added in `.env` file, present at `builder/partnerproduct/`.

  ```
  ANTHROPIC_API_KEY = <check_references_below>
  ```

### References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### Model Name
  You can pick any model from the [updated list](https://docs.anthropic.com/en/docs/about-claude/models#model-names) given in Anthropic documents.

- #### Llama index Models
  You can pick any model from the list in [this documentation](https://legacy.ts.llamaindex.ai/api/classes/Anthropic#accessors) 
  excluding ***claude-instant-1.2*** and ***claude-3-5-haiku***.

- ##### API Key 

  You will need to [sign up](https://www.anthropic.com/api) and retrieve an Anthropic API Key.
