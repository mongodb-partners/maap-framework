---
sidebar_position: 1
---

# MAAP Frameworks 

The MongoDB AI Applications Program (MAAP) Framework is a comprehensive solution for building advanced AI applications that leverage MongoDB's powerful database capabilities alongside cutting-edge AI technologies. 

## Frameworks
The framework consists of two complementary approaches to AI application development. The first is a traditional Retrieval-Augmented Generation (RAG) framework, which excels at enhancing LLM responses with context from your own data sources, making it ideal for knowledge-intensive applications. The second is a sophisticated agent-based framework that builds upon RAG capabilities to create intelligent agents capable of complex reasoning, memory management, and tool manipulation. More information on each can be referred below.

### 🤖 Agentic Framework
The Agentic framework extends the capabilities through intelligent agents that combine three key functionalities, all powered by MongoDB's distributed architecture. 

First, they **perform complex reasoning** through sophisticated task decomposition and contextual decision-making, enabling agents to break down complex problems into manageable steps, adapt to changing conditions, and optimize solution paths using advanced planning algorithms. 

Second, they **maintain sophisticated memory systems** that blend short-term working memory with long-term knowledge storage in MongoDB, utilizing both episodic and semantic memory management to retain context, learn from past interactions, and build comprehensive knowledge bases that improve over time. 

Finally, they **execute tool-augmented tasks** through seamless API integrations and custom tool development, orchestrating function calls and managing parallel executions to accomplish complex operations while maintaining state consistency and handling failures gracefully.

:::info

Visit the [Agentic Framework](./agentic/intro.md) to learn more about its components and capabilities.

:::


### 🧠 RAG Framework 

The RAG component of MAAP provides a robust foundation for building AI applications that combine the power of large language models with your own data through three core components:

The **Data Processing Pipeline** forms the framework's foundation with comprehensive data handling capabilities. It includes versatile loaders for multiple file formats, configurable chunking strategies for optimal text segmentation, and efficient vectorization processes that transform content into high-dimensional representations suitable for retrieval.

The framework's **Vector Search Integration** leverages MongoDB Atlas Vector Search to provide seamless, scalable vector-based information retrieval. It features optimized indexing mechanisms and supports multiple embedding models, offering flexibility to choose the most appropriate model for your specific needs.

The **Advanced Retrieval Techniques** component enhances search quality through intelligent query processing and result refinement. It combines pre-query processing, post-retrieval re-ranking, and context refinement to ensure accurate and contextually appropriate responses.

Integrating directly with various MAAP partners the framework is able to demonstrate the core value of MongoDB.

:::info

Visit the [RAG Framework](./rag/intro.md) to learn more about its components and capabilities.

:::

## Security Considerations

### Network and Firewall Configuration

#### **MongoDB Atlas:**
- **IP Access List:**
  - Restrict client connections to your Atlas clusters by configuring IP access lists.
  - Add the public IP addresses of your application environments to the IP access list to permit access.
  - For enhanced security, consider using VPC peering or private endpoints to allow private IP addresses.
  - [Configure IP Access List Entries](https://www.mongodb.com/docs/atlas/security/ip-access-list/).

- **Ports 27015 to 27017 (TCP):**
  - Ensure that your firewall allows outbound connections from your application environment to Atlas on ports **27015 to 27017** for TCP traffic.
  - This configuration enables your applications to access databases hosted on Atlas.

#### **AWS Services (e.g., Bedrock):**
- **Port 443 (HTTPS):**
  - Required for API calls and interactions.
  - Configure security groups to allow outbound traffic on port 443.
  - Ensure Network ACLs permit inbound and outbound traffic on this port.

### Authentication and Authorization

- **Database Users:**
  - Atlas mandates client authentication to access clusters.
  - Create database users with appropriate roles to control access.
  - [Configure Database Users](https://www.mongodb.com/docs/atlas/security/config-db-auth/).

- **Custom Roles:**
  - If default roles don't meet your requirements, define custom roles with specific privileges.
  - [Create Custom Roles](https://www.mongodb.com/docs/atlas/security/config-db-auth/#custom-database-roles).

- **AWS IAM Integration:**
  - Authenticate applications running on AWS services to Atlas clusters using AWS IAM roles.
  - Set up database users to use AWS IAM role ARNs for authentication.
  - [AWS IAM Authentication](https://www.mongodb.com/docs/atlas/security/config-db-auth/#authentication-with-aws-iam).

### Data Encryption

- **Encryption at Rest:**
  - Atlas encrypts all data stored on your clusters by default.
  - For enhanced security, consider using your own key management system.
  - [Encryption at Rest](https://www.mongodb.com/docs/atlas/security/encryption-at-rest/).

- **TLS/SSL Encryption:**
  - Atlas requires TLS encryption for client connections and intra-cluster communications.
  - Ensure your applications support TLS 1.2 or higher.
  - [TLS/SSL Configuration](https://www.mongodb.com/docs/atlas/security/tls-ssl/).

### Network Peering and Private Endpoints

- **VPC Peering:**
  - Establish VPC peering between your AWS VPC and MongoDB Atlas's VPC to eliminate public internet exposure.
  - [Set Up a Network Peering Connection](https://www.mongodb.com/docs/atlas/security/vpc-peering/).

- **Private Endpoints:**
  - Use AWS PrivateLink to create private endpoints for secure communication within AWS networks.
  - [Configure Private Endpoints](https://www.mongodb.com/docs/atlas/security-cluster-private-endpoint/).

- **NAT Gateway:**
  - Use NAT Gateways to route traffic from private subnets while preventing direct internet access to EC2 instances.

- **Specific IP Ranges:**
  - AWS services like Bedrock use dynamic IPs. Filter these from [AWS IP Ranges](https://ip-ranges.amazonaws.com/ip-ranges.json) for egress traffic.

### Compliance and Monitoring

- **Audit Logging:**
  - Enable audit logging to monitor database activities and ensure compliance with data protection regulations.
  - [Enable Audit Logging](https://www.mongodb.com/docs/atlas/security/audit-logging/).

- **Regular Updates:**
  - Keep your dependencies and Docker images up to date to address security vulnerabilities.

## Next Steps

- Explore the [RAG Framework](./rag/intro.md) for building search and retrieval applications
- Learn about the [Agentic Framework](./agentic/intro.md) for creating intelligent agents
- Check out our [Quick Start Guides](../category/-quick-starts) for hands-on examples

## Contributing

We welcome contributions to the MAAP Framework! Please see our contribution guidelines for more information on how to:
- Report issues
- Submit pull requests
- Propose new features
- Improve documentation

## License

The MAAP Framework is available under the [Apache 2.0 License](https://github.com/mongodb-partners/maap-framework/blob/main/LICENSE).
