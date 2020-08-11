import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App () {

  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('react hooks');
  const [error, setError] = useState(null);

  // to display loading message
  const [loadingMessage, setLoadingMessage] = useState(false);

  // to access DOM element
  // taking ref object & assigned it to one of the element 
  const searchInputRef = useRef();

  // fetching data from api
  const fetchResults = async () => {
    // set to true before loading which displays a message
    setLoadingMessage(true)

    // error handling 
    try {
      const { data } = await axios.get(`http://hn.algolia.com/api/v1/search?query=${query}`)
      console.log(data.hits)
      setResults(data.hits)
    } catch (error) {
      // display error piece of state
      setError(error)
    }
    
    
    // set to false after loading 
    setLoadingMessage(false)
  }

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line 
  }, []);

  // submit handler
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchResults();
    // setQuery('');
  }

  const handleClearSearch = () => {
    setQuery('')
    searchInputRef.current.focus()
  }

  const renderResults = results.map(result => {

    const { objectID, url, title } = result;

    return (
      <li key={objectID}>
        <a href={url}>{title}</a>
      </li>
    )
  })
  return(
    <div>
      <form onSubmit={handleSubmit}>
        <input 
        type="text" 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        ref={searchInputRef}
        />

        <button type="button" onClick={fetchResults} >Search</button>
        <button type="button" onClick={handleClearSearch}>Clear</button>
      </form>
      
      <ul>
        { loadingMessage ? <div>Loading results...</div> : renderResults }
      </ul>

      {error && <div>{error.message}</div>}
    </div>// displaying error message

  ) // on true, set loading message
}
// ref={searchInputRef} - doing this will make us access to the input attribs

export default App;