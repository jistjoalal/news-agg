import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  state = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY
  };
  
  setSearchTopStores = result => {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({ 
      results: { 
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }
  
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchSubmit = e => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
    e.preventDefault();
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
      &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    fetch(url)
      .then(res => res.json())
      .then(result => this.setSearchTopStores(result))
      .catch(error => error)
  }

  onDismiss = id => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }
  
  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  }
  
  render() {
    const { searchTerm, results, searchKey }  = this.state;
    const page = (results && results[searchKey]
      && results[searchKey].page) || 0;
    const list = (results && results[searchKey]
      && results[searchKey].hits) || [];
    
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search:
          </Search>
          <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        </div>
        <div className="interactions">
          <Button onClick={() =>
            this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </Button>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

const Table = ({ list, pattern, onDismiss }) => 
  <div className="table">
    {list.map(item => {
      const [ lg, md, sm ] = [{width: '40%'}, {width: '30%'}, {width: '10%'}];
      return (
        <div key={item.objectID} className="table-row">
          <span style={lg}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={md}>
            {item.author}
          </span>
          <span style={sm}>
            {item.num_comments}
          </span>
          <span style={sm}>
            {item.points}
          </span>
          <span style={sm}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
            >
              Dismiss
            </Button>
          </span>
        </div>
      );
    })}
  </div>

const Button = ({ onClick, className = '', children }) => 
    <button onClick={onClick} className={className}>
      {children}
    </button>

export default App;
