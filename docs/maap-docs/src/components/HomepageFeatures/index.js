import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
// #001e2b
const FeatureList = [
  {
    title: 'Framework Documentation',
    Svg: require('@site/static/img/framework-docs.svg').default,
    description: (
      <>
        Explore our comprehensive framework documentation covering RAG and Agentic implementations. Learn about data processing pipelines, vector search integration, memory systems, and intelligent agents built on MongoDB Atlas.


      </>
    ),
  },
  {
    title: 'Quick Start Guides',
    Svg: require('@site/static/img/quickstart.svg').default,
    description: (
      <>
        Get started quickly with step-by-step guides for building AI applications. Our quickstart tutorials cover everything from initial setup to deploying your first RAG or agent-based application.


      </>
    ),
  },
  {
    title: 'Technical Blog Posts',
    Svg: require('@site/static/img/blog-posts.svg').default,
    description: (
      <>
        Stay updated with the latest technical insights, best practices, and real-world implementation examples. Our blog posts showcase advanced features and integration patterns using MongoDB and partner technologies.


      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
