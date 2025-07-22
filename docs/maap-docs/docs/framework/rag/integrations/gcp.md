---
sidebar_position: 3
---

# GCP




[Vertex AI](https://cloud.google.com/vertex-ai?hl=en) is a comprehensive AI development platform powered by GCP. It is fully managed and unified, designed for creating and deploying generative AI solutions. It offers access to Vertex AI Studio, Agent Builder, and over 150 foundational models, including Gemini 1.5 Pro and Gemini 1.5 Flash, enabling seamless development and utilization of advanced AI capabilities.


### Setting up VertexAI

#### 1. Setup GCP Project, gcloud CLI and Vertex AI
- Instructions can be followed [here](https://cloud.google.com/vertex-ai/docs/start/cloud-environment).

#### 2. (Optional) [Create a new Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts) with least permissive role. 
_You can use role [Vertex AI User](https://cloud.google.com/vertex-ai/docs/general/access-control#aiplatform.user) `roles/aiplatform.user`._

#### 3. Authentication
 
 Documentation: [VertexAI Authentication](https://cloud.google.com/vertex-ai/docs/authentication)

1)  `gcloud CLI` Application default login.  (**Preferred for local development.**)
 
    - Refer [here](https://cloud.google.com/docs/authentication/application-default-credentials#personal) for documentation.

    -  You should be logged in an account, which has permissions for the project.
      ```
      gcloud auth application-default login
      ```

2) **On Google Cloud Platform**: 
    - Using a service account which has permissions to the project and VertexAI

    - Refer [here](https://cloud.google.com/vertex-ai/docs/authentication#on-gcp) for documentation.

3) Environment variable with path to JSON key for Service Account

    - Refer [here](https://cloud.google.com/docs/authentication/application-default-credentials#GAC) for documentation.


    - Download the Service Account's key after you have created it in Step 2.

    - Setup `GOOGLE_APPLICATION_CREDENTIALS` .env variable with the path to the downloaded JSON credentials:

    ```
    GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
    GOOGLE_VERTEX_LOCATION=<optional, defaults to 'us-central1'>
    ```

    For embeddings the following variable is needed:
    ```
    GOOGLE_CLOUD_PROJECT_NUMBER=<project_number>
    ```

    For the LLM Model the following variable is needed:
    ```
    GOOGLE_VERTEX_PROJECT=<project_name>
    ```

    _NOTE: Using service account with JSON key can impose security risk if not stored correctly. Make sure you are following the [best practices](https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys)._



## Deploying your Model

VertexAI, offers the capability to deploy both Chat Models(LLM) as well as Embedding Models from the console.


### LLM Model 

Go through the VertexAI [documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models) and start deploying your model. You can test out the model in VertexAI > Chat Playground. 

Once your model is deployed successfully, you can use it to serve the LLM purpose in the MAAP framework.

#### Usage with MAAP
To use VertexAI model with MAAP framework, you would need to feed below values.

- #### Config File :
  Provided below are the values required to be added in `config.yaml` file in LLM section.
  ```
  llms:
      class_name: VertexAI
      model_name: <check_references_below>
      temperature: <integer_value>
  ```


### Embedding Model

VertexAI uses gecko embedding for creating embeddings, the list of supported models can be found [here](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/text-embeddings-api#model_versions).

#### Usage with MAAP
To use VetexAI embedding with MAAP framework, you would need to feed below values.


- #### Config File :
  Provided below are the values required to be added in `config.yaml` file in embedding section.
  ```
  embedding:
      class_name: VertexAI
  ```

## Deploying your model using the LlamaIndex framework

MAAP now provides the option to choose if you want to use LlamaIndex as your main framework to deploy your embeddings.

This can be done by adding the 'framework' configuration to the config.yaml file
- #### Config File
  ```
  embedding:
    class_name: VertexAI
    model_name: <check_references_below>
    framework: 'LlamaIndex'
  ```

### References

Provided below are the instructions on how to procure the right values for building your MAAP framework.

- ##### Model Name
  A list of models that Vertex AI facilitates can be found [here](https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models).
- ##### Models supported by llama
  The models supported by llama can be found [here](https://legacy.ts.llamaindex.ai/api/enumerations/GEMINI_MODEL).
