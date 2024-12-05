import React, { useState } from 'react';
import {
  SearchInput,
} from '@leafygreen-ui/search-input';
import Card from '@leafygreen-ui/card';
import { PageLoader, Spinner } from "@leafygreen-ui/loading-indicator";
import './search.css';
import { H1, H2 } from '@leafygreen-ui/typography';
import { NumberInput } from '@leafygreen-ui/number-input';

function Search({ hybrid }) {
  const isHybridSearch = hybrid
  const [searchValue, setSearchValue] = useState('');
  const [vectorWeight, setVectorWeight] = useState(0.5);
  const [textWeight, setTextWeight] = useState(0.5);
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const searchEndpoint = `http://localhost:9001/${isHybridSearch ? 'hybrid-search' : 'semantic-search'}`;

  const searchResults = () => {
    console.log(searchValue);
    setLoading(true);
    const query = encodeURIComponent(searchValue);
    fetch(`${searchEndpoint}?query=${query}&vectorWeight=${vectorWeight}&fullTextWeight=${textWeight}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setResponse(data);
        setLoading(false);
      })
      .catch(error => {
        console.log("error", error);
      })
  };

  return (
    <div className="search-bar">
      <H1>{ isHybridSearch ? "Hybrid Search" : "Vector Search"}</H1>
      <header className="search-header">
        <SearchInput
          value={searchValue}
          onChange={handleInputChange}
          onSubmit={searchResults}
        />
        { isHybridSearch && <>
          <NumberInput
            label='Vector Weight'
            description='Affects the weighted reciprocal rank'
            darkMode="true"
            value={vectorWeight}
            onChange={(e) => setVectorWeight(e.target.value)}
          />
          <NumberInput
            label='Text Weight'
            description='Affects the weighted reciprocal rank'
            darkMode="true"
            value={textWeight}
            onChange={(e) => setTextWeight(e.target.value)}
          />
        </> }
      </header>
      <div className='results'>
        <>
          {loading ? <PageLoader /> : <div>
            {response.map((item, index) => (
              <Card key={index} className="card-styles" as="article">
                <h3>Score: {item.score}</h3>
                { isHybridSearch && <pre>Text Score: {item.fts_score}, Vector Score: {item.vs_score}</pre> }
                <p><strong>Content:</strong> {item.pageContent}</p>
                <div>
                  <h4>Metadata:</h4>
                  <pre>{JSON.stringify(item.metadata, null, 2)}</pre>
                </div>
              </Card>
            ))}
          </div>}
        </>
      </div>
    </div>
  );
}

export default Search;
