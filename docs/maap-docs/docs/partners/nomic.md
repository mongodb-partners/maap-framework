---
sidebar_position: 8
---

# Nomic

## Introduction

[Nomic](https://www.nomic.ai/) builds products that make AI systems and their data more accessible and explainable.


## Deploying your model
Nomic offers the capability to deploy various embedding models under its umbrella, to facilitate easy and scaleable embedding options. 


### Embedding Model

Refer to their [documentation](https://blog.nomic.ai/posts/nomic-embed-text-v1) to understand the latest offerings.

#### Usage with MAAP
To use Nomic embedding with MAAP framework, you would need to feed below values.


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
  NOMIC_API_KEY = <check_references_below>
  ```


### References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### Model Name
  You can pick any model from the [updated list](https://blog.nomic.ai/posts/nomic-embed-text-v1) given in Nomic documentation.

- ##### API Key 

  You will need to [sign up](https://docs.nomic.ai/atlas/introduction/quick-start) and retrieve a Nomic API Key.
