---
sidebar_position: 12
---

# Ollama


## Introduction

[Ollama](https://ollama.com/) is a powerful platform for running local AI models with enhanced privacy and control. It enables developers to deploy and customize chat completion models with ease.

## Deploying your model

Ollama supports deploying various Chat Models, including advanced LLMs tailored for local usage. For personal use you must create an account and [download](https://www.ollama.com/download) Ollama into your computer.

### Chat Model
Refer to their [blog](https://www.ollama.com/blog) to understand the latest offerings and features.

#### Usage with MAAP
To use the Ollama chat model with the MAAP framework, you would need to feed the below values.

- #### Config File:
  Provided below are the values required to be added in the `config.yaml` file in the LLM section.
  ```yaml
  llms:
    class_name: Ollama
    model_name: <check_references_below>
    base_url: <optional, defaults to http://localhost:11434>
    ```

- #### Environment Variable :
No additional environment variables are required, as Ollama operates locally by default.

## Deploying your model using the LlamaIndex framework

### Chat Model

MAAP now provides the option to choose if you want to use LlamaIndex as your main framework to deploy your LLM models.

This can be done by adding the 'framework' configuration to the config.yaml file
- #### Config File
  ```yaml
  llms:
    class_name: Ollama
    model_name: <check_references_below>
    base_url: <optional, defaults to http://localhost:11434>
    framework: llamaindex
  ```

### References
For more information on setting up and using Ollama, visit their documentation.

- ##### Model Name
  You can pick any model from the [updated list](https://www.ollama.com/search) given in the Ollama website.






