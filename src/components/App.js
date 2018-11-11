import React, { Component } from 'react';
import axios from 'axios';

import '../styles/App.css';
import Search from './Search';
import ResultTable from './ResultTable';
import { Button, ButtonWithLoading } from './generic';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };
  }
  
  componentDidMount() {
    this.setState(prevState => {
      return { searchKey: prevState.searchTerm }
    });
    this.fetchSearchTopStories(this.state.searchTerm);
  }
  
  render() {
    const { searchTerm, results, searchKey, error, isLoading,
      isSortReverse }  = this.state;
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
            onFocus={this.onFocus}
          >
            Search
          </Search>
          <ResultTable
            list={list}
            onDismiss={this.onDismiss}
            isSortReverse={isSortReverse}
            error={error}
          />
        </div>
        <div className="interactions">
          <ButtonWithLoading
            className="button-clickable"
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }

  // clear search input on focus
  onFocus = () => {
    this.setState({searchTerm: ''});
  }
  
  // control search input
  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  }

  // submit search input
  onSearchSubmit = e => {
    const { searchTerm } = this.state;
    this.setState(prevState => {
      return { searchKey: prevState.searchTerm }
    });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    e.preventDefault();
  }

  // remove hit from result list
  onDismiss = id => {
    this.setState(prevState => {
      const { searchKey, results } = prevState;
      const { hits, page } = results[searchKey];
  
      const isNotId = item => item.objectID !== id;
      const updatedHits = hits.filter(isNotId);
      return {
        results: {
          ...results,
          [searchKey]: { hits: updatedHits, page }
        }
      };
    });
  }

  // is result for searchTerm cached already?
  needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];

  // makes request to HN API
  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });

    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`
      + `&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;

    axios(url)
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error, isLoading: false }))
  }
  
  // stores response in state.results, appending to existing hits
  setSearchTopStories = response => {
    const { hits, page } = response;
    this.setState(this.updateSearchTopStories(hits, page));
  }

  // appends additional hits from 'more' button to page
  updateSearchTopStories = (hits, page) => prevState => {
    const { searchKey, results } = prevState;
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    return { 
      results: { 
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false
    };
  }
}

export default App;
export { Button, Search };
