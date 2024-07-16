import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
// #001e2b
const FeatureList = [
  {
    title: 'Reference architectures',
    Svg: require('@site/static/img/connectors.svg').default,
    description: (
      <>
        With hands-on Professional Services, gen AI reference architectures, and integrated technology and partners, customers can build secure, high-performing applications that function as intended.


      </>
    ),
  },
  {
    title: 'Full-service engagement',
    Svg: require('@site/static/img/general_features_on_demand.svg').default,
    description: (
      <>
        Engagement begins with personalized deep dives from Professional Services to evaluate your current technology stack and identify business problems to solve.


      </>
    ),
  },
  {
    title: 'Atlas support package',
    Svg: require('@site/static/img/realm_real_time_collaboration.svg').default,
    description: (
      <>
        Develop end-to-end strategies and roadmaps to build, deploy, and scale generative AI applications with hands-on support.


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
