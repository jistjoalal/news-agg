import React, { Component } from 'react';
import axios from 'axios';

import '../styles/App.css';
import { Button, ButtonWithLoading, withSource } from './generic';
import Search from './Search';
import ResultTable from './ResultTable';

const DEFAULT_QUERY = 'redux';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      source: 'HN',
    };
  }
  
  componentDidMount() {
    this.setState(prevState => {
      return { searchKey: prevState.searchTerm }
    });
    this.getStories(this.state.searchTerm);
  }
  
  render() {
    const { searchTerm, results, searchKey, error, isLoading,
      isSortReverse, source }  = this.state;
    const list = (results && results[searchKey]
      && results[searchKey].hits) || [];
    
    return (
      <div className="page">
        <div className="interactions">
          <input type="radio" value="HN"
            checked={source === 'HN'}
            onChange={this.onSourceChange} />HN
          <input type="radio" value="Reddit"
            checked={source === 'Reddit'}
            onChange={this.onSourceChange} />Reddit
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
            onClick={() => this.getMoreStories(searchKey)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }

  getMoreStories = searchTerm => {
    const { source, results } = this.state;
    if (source === 'HN') {
      const page = (results && results[searchTerm]
        && results[searchTerm].page) || 0;
      this.fetchStories(searchTerm, page + 1);
    }
    else if (source === 'Reddit') {
      //
    }
  }

  getStories = searchTerm => {
    if (this.state.source === 'HN') {
      this.fetchStories(searchTerm);
    }
    else if (this.state.source === 'Reddit') {
      this.fetchStories(searchTerm);
    }
  }

  // makes request to HN API
  fetchStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true, error: null });
    axios(withSource(this.state.source)(searchTerm, page))
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error, isLoading: false }))
  }
  
  // stores response in state.results, appending to existing hits
  setSearchTopStories = response => {
    if (this.state.source === 'HN') {
      const { hits, page } = response;
      this.setState(this.updateSearchTopStories(hits, page));
    }
    else if (this.state.source === 'Reddit') {
      const { children, after } = response.data;
      console.log(children, after);
      this.setState(this.updateSearchTopStories(children, after));
    }
  }

  onSourceChange = event => {
    this.setState({ source: event.target.value });
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
      this.getStories(searchTerm);
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
