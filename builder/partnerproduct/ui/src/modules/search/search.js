import React, { useState } from 'react';
import {
  SearchInput,
} from '@leafygreen-ui/search-input';
import Card from '@leafygreen-ui/card';
import { PageLoader, Spinner } from "@leafygreen-ui/loading-indicator";
import './search.css';
import { H1, H2 } from '@leafygreen-ui/typography';

function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const searchResults = () => {
    console.log(searchValue);
    setLoading(true);
    const query = encodeURIComponent(searchValue);
    fetch(`http://localhost:9001/semantic-search?query=${query}`, {
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
      <H1>Vector Search</H1>  
      <header className="search-header">
        <SearchInput
          value={searchValue}
          onChange={handleInputChange}
          onSubmit={searchResults}
        />
      </header>
      <div className='results'>
        <>
          {loading ? <PageLoader /> : <div>
            {response.map((item, index) => (
              <Card key={index} className="card-styles" as="article">
                <h3>Score: {item.score}</h3>
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