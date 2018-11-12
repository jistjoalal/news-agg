import React, { Component } from 'react';
import axios from 'axios';

import '../styles/App.scss';
import Search from './Search';
import ResultTable from './ResultTable';
import { Button, ButtonWithLoading, withSource, COLUMNS } from './generic';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: 'react',
      error: null,
      isLoading: false,
      source: 'HN',
      needFetch: true,
    };
  }
  
  componentDidMount() {
    this.setState(prevState => {
      return { searchKey: prevState.searchTerm }
    });
  }

  componentDidUpdate() {
    const { searchTerm, source } = this.state;
    if (this.state.needFetch) {
      if (this.needsToSearchTopStories(searchTerm, source)) {
        this.fetchStories(searchTerm);
      }
      this.setState({ needFetch: false });
    }
  }
  
  render() {
    const { searchTerm, results, searchKey, error, isLoading,
      isSortReverse, source }  = this.state;
    const list = (results && results[source] && results[source][searchKey]
      && results[source][searchKey].hits) || [];
    
    return (
      <div className="page">
        <div className="interactions">
          <div className="SourceSelect">
            <input className="SourceSelect-radio"
              type="radio" value="HN"
              checked={source === 'HN'}
              onChange={this.onSourceChange} />HN
            <input className="SourceSelect-radio"
              type="radio" value="Reddit"
              checked={source === 'Reddit'}
              onChange={this.onSourceChange} />Reddit
          </div>
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
            source={source}
          />
        </div>
        <div className="interactions">
          <ButtonWithLoading
            className="button-clickable"
            isLoading={isLoading}
            onClick={() => this.fetchMoreStories(searchKey)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }

  fetchMoreStories = searchTerm => {
    const { source, results } = this.state;
    if (source === 'HN') {
      const page = (results && results[searchTerm]
        && results[searchTerm].page) || 0;
      this.fetchStories(searchTerm, page + 1);
    }
    else if (source === 'Reddit') {
      // TODO: reddit more stories
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
      const children = response.data.children.map(c => c.data);
      const after = response.data.after;
      this.setState(this.updateSearchTopStories(children, after));
    }
  }

  onSourceChange = event => {
    this.setState({ source: event.target.value, needFetch: true });
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
    const { searchTerm, source } = this.state;
    this.setState(prevState => {
      return { searchKey: prevState.searchTerm }
    });

    if (this.needsToSearchTopStories(searchTerm, source)) {
      this.fetchStories(searchTerm);
    }
    e.preventDefault();
  }

  // remove hit from result list
  onDismiss = id => {
    this.setState(prevState => {
      const { searchKey, results, source } = prevState;
      const { hits, page } = results[source][searchKey];
      const ID_COL = COLUMNS[source].ID;
      const updatedHits = hits.filter(item => item[ID_COL] !== id);
      return {
        results: {
          [source]: {
            ...results,
            [searchKey]: { hits: updatedHits, page }
          }
        }
      };
    });
  }

  // is result for searchTerm cached already?
  needsToSearchTopStories = (searchTerm, source) => {
    const { results } = this.state;
    if (results && results[source] && results[source][searchTerm]) {
      return false;
    }
    return true;
  }

  // appends additional hits from 'more' button to page
  updateSearchTopStories = (hits, page) => prevState => {
    const { searchKey, results, source } = prevState;
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    return {
      results: {
        ...results,
        [source]: { 
          [searchKey]: { hits: updatedHits, page }
        }
      },
      isLoading: false
    }
  }
}

export default App;
export { Button, Search };
