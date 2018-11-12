import React, { Component } from 'react';
import axios from 'axios';

import { COLUMNS, withSource } from '../generic';
import Table from './Table';
import Footer from './Footer';

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      isLoading: false,
      isSortReverse: false,
      error: null,
      sourceKey: null,
    }
  }

  componentDidUpdate() {
    const { sourceKey, results } = this.state;
    const { source, searchKey } = this.props;
    // change of source
    if (sourceKey !== source) {
      // results not yet cached
      if (!this.resultsSaved(results, source, searchKey)) {
        this.fetchStories(source, searchKey);
      }
      this.setState({ sourceKey: source });
    }
  }

  render() {
    const { results, isLoading, isSortReverse, error } = this.state;
    const { source, searchKey } = this.props;
    const isSaved = this.resultsSaved(results, source, searchKey);
    const list = isSaved ? isSaved.hits : [];
    return (
      <div className="interactions">
        <Table list={list} onDismiss={this.onDismiss}
          isSortReverse={isSortReverse} error={error} source={source} />

        <Footer isLoading={isLoading} searchKey={searchKey} 
          fetchMore={this.fetchMoreStories} source={source}/>
      </div>
    );
  }

  fetchMoreStories = (source, searchKey) => {
    const { results } = this.state;
    const isSaved = this.resultsSaved(results, source, searchKey);
    const page = isSaved ? isSaved.page : 0;
    if (source === 'HN') {
      this.fetchStories(source, searchKey, page + 1);
    }
    else if (source === 'Reddit') {
      this.fetchStories(source, searchKey, page);
    }
  }

  // makes request to API
  fetchStories = (source, searchKey, page = 0) => {
    console.log('fetching')
    this.setState({ isLoading: true, error: null });
    axios(withSource(source)(searchKey, page))
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error, isLoading: false }))
  }
  
  // stores response in state.results, appending to existing hits
  setSearchTopStories = response => {
    if (this.props.source === 'HN') {
      const { hits, page } = response;
      this.setState(this.updateSearchTopStories(hits, page));
    }
    else if (this.props.source === 'Reddit') {
      const children = response.data.children.map(c => c.data);
      const after = response.data.after;
      this.setState(this.updateSearchTopStories(children, after));
    }
    else {
      // no source
    }
  }

  // appends additional hits from 'more' button to page
  updateSearchTopStories = (hits, page) => prevState => {
    const { results } = prevState;
    const { source, searchKey } = this.props;
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

  // remove hit from result list
  onDismiss = id => {
    this.setState(prevState => {
      const { results } = prevState;
      const { source, searchKey } = this.props;
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

  resultsSaved = (results, source, searchKey) => {
    return results && results[source] && results[source][searchKey];
  }
}

export default Results;