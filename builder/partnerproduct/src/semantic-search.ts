import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';

import {
  getDatabaseConfig,
  getEmbeddingModel,
  getModelClass,
} from '../../../src/yaml_parser/src/LoadYaml.js';

import { RAGApplicationBuilder } from "../../../src/index.js";

const app = express();
const port = 9001;

app.use(express.json());
app.use(cors());

const llmApplication = await new RAGApplicationBuilder()
  .setModel(getModelClass())
  .setEmbeddingModel(getEmbeddingModel())
  .setVectorDb(getDatabaseConfig())
  .setSearchResultCount(5)
  .build();

app.get('/semantic-search', async (req: Request, res: Response) => {
  try {
    const userQuery = req.query.query;

    if (!userQuery) {
      return res.status(400).send('Query is required');
    }

    llmApplication.vectorQuery(userQuery as string).then((result) => {
      console.log('Result:', result);
      res.send(result);
    });

  } catch (error) {
    console.error('Error during vector search:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

app.get('/hybrid-search', async (req: Request, res: Response) => {
  try {
    const userQuery = asString(req.query.query);
    const vectorWeight = asFloat(req.query.vectorWeight ?? 0.5);
    const fullTextWeight = asFloat(req.query.fullTextWeight ?? 0.5);

    if (!userQuery) {
      return res.status(400).send('Query is required');
    }

    llmApplication.hybridQuery(userQuery, vectorWeight, fullTextWeight).then((result) => {
      console.log('Result:', result);
      res.send(result);
    });

  } catch (error) {
    console.error('Error during hybrid vector search:', error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function asString(value: any): string { return typeof value !== 'undefined' ? value.toString() : ''; }
function asFloat(value: any): number { return typeof value !== 'undefined' ? parseFloat(value.toString()) || 0 : 0; }
