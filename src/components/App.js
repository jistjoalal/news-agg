import React, { Component } from 'react';
import axios from 'axios';

import '../styles/App.scss';
import Search from './Search';
import ResultTable from './ResultTable';
import SourceSelect from './Sources';
import { Button, ButtonWithLoading, withSource, COLUMNS } from './generic';

// TODO: refactor
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
  
  // TODO: "back to top" button
  render() {
    const { searchTerm, results, searchKey, error, isLoading,
      isSortReverse, source }  = this.state;
    const isSaved = this.resultsSaved(results, source, searchKey);
    const list = isSaved ? isSaved.hits : [];
    
    return (
      <div className="page" id="top">
        <div className="interactions">
          <SourceSelect source={source} onChange={this.onSourceChange} />
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
        <div className="interactions footer">
          <ButtonWithLoading
            className="button-clickable"
            isLoading={isLoading}
            onClick={() => this.fetchMoreStories(searchKey)}
          >More
          </ButtonWithLoading>
          <a href="#top" className="backtotop">
            <Button className="button-clickable" onClick={() => true}>
                Back to top
            </Button>
          </a>
        </div>
      </div>
    );
  }

  fetchMoreStories = searchTerm => {
    const { source, results } = this.state;
    const isSaved= this.resultsSaved(results, source, searchTerm);
    if (source === 'HN') {
      const page = isSaved ? isSaved.page : 0;
      this.fetchStories(searchTerm, page + 1);
    }
    else if (source === 'Reddit') {
      const after = isSaved ? isSaved.page : 0;
      this.fetchStories(searchTerm, after);
    }
  }

  // makes request to API
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

  resultsSaved = (results, source, searchKey) => {
    return results && results[source] && results[source][searchKey];
  }

  // appends additional hits from 'more' button to page
  updateSearchTopStories = (hits, page) => prevState => {
    const { searchKey, results, source } = prevState;
    const oldHits = this.resultsSaved(results, source, searchKey)
      ? results[source][searchKey].hits : [];
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
