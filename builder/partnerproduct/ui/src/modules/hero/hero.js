import React, { useState } from 'react';
import './hero.css';
import { Body, H1, H2 } from '@leafygreen-ui/typography';

function Hero() {

  return (
    <>
      <div>
        <H1 className={"header"}>
          Why build on MongoDB?
        </H1>
      </div>
      <div className="data-layer-container">
        <Body className={"paragraph"}>
          MAAP helps organizations rapidly build and put applications into production with 
          advanced AI capabilities by providing them with reference architectures and an end-to-end 
          technology stack that includes integrations with leading technology providers, professional 
          services, and a unified support system.
        </Body>
        <Body className="data-layer-box">Embedding Models</Body>
        <Body className="data-layer-box">Large Language Models</Body>
        <Body className="data-layer-box">Frameworks</Body>
        <Body className="data-layer-box">Enterprise Data Connectors</Body>
        <Body className="data-layer-box">System Integrations</Body>
        <Body className="data-layer-box">Model Hosting & Cloud Providers</Body>
      </div>
    </>
  );
};

export default Hero;