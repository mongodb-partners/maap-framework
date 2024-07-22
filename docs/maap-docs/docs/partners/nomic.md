---
sidebar_position: 8
---

# Nomic

## Introduction

[Nomic](https://www.nomic.ai/) builds products that make AI systems and their data more accessible and explainable.


## Deploying your model
Nomic offers the capability to deploy various embedding models under its umbrella, to facilitate easy and scalable embedding options. 


### Embedding Model

Refer to their [documentation](https://blog.nomic.ai/posts/nomic-embed-text-v1) to understand the latest offerings.

#### Usage with MAAP
To use Nomic embedding with MAAP framework, you would need to feed below values.


- #### Config File :
  Provided below are the values required to be added in `config.yaml` file in embedding section. You can select the version 1 or 1.5 for Nomic.
  ```
  embedding:
      class_name: Nomic-v1.5 or Nomic-v1
  ```

- #### Environment Variable :
  Below value(s) are to be added in `.env` file, present at `builder/partnerproduct/`.

  ```
  FIREWORKS_API_KEY = <check_references_below>
  ```


### References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### API Key 

  Nomic works using Fireworks underneath, thus Fireworks API key needs to be updated here. You will need to [sign up](https://readme.fireworks.ai/docs/quickstart) and retrieve a Fireworks API Key.