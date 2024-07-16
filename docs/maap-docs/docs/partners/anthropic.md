---
sidebar_position: 4
---

# Anthropic

## Introduction

[Anthropic](https://www.anthropic.com/) is a San Francisco-based company specializing in AI safety and research. 

## Deploying your model
Anthropic offers the capability to deploy various Chat Models(LLM) under its umbrella. 

### LLM Model 

Refer to their [documentation](https://docs.anthropic.com/en/docs/about-claude/models) to understand the latest offerings, with feature and cost comparisons.

#### Usage with MAAP
To use Antrhopic model with MAAP framework, you would need to feed below values.

- #### Config File :
  Provided below are the values required to be added in `config.yaml` file in LLM section.
  ```
  llms:
      class_name: Anthropic
      model_name: <check_references_below>
  ```

- #### Environment Variable :
  Below value(s) are to be added in `.env` file

  ```
  ANTHROPIC_API_KEY = <check_references_below>
  ```

### References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### Model Name
  You can pick any model from the [updated list](https://docs.anthropic.com/en/docs/about-claude/models#model-names) given in Antropic documents.

- ##### API Key 

  You will need to [sign up](https://www.anthropic.com/) and retrieve an Anthropic API Key.
