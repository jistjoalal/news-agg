import React, { Component } from 'react';
import axios from 'axios';

import { COLUMNS, withSource } from '../generic';
import Table from './Table';
import Footer from './Footer';

//TODO: comments

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      isSortReverse: false,
      isLoading: false,
      error: null,
      lastSource: null,
      lastSearchKey: null,
    }
  }

  // initial fetch
  componentDidMount() {
    const { source, searchKey } = this.state;
    this.fetchStories(source, searchKey);
  }

  // need to fetch results?
  componentDidUpdate() {
    const { lastSource, lastSearchKey, results } = this.state;
    const { source, searchKey } = this.props;

    // change of source or searchKey
    if (lastSource !== source || searchKey !== lastSearchKey) {
      // results not yet cached
      if (!this.resultsSaved(results, source, searchKey)) {
        this.fetchStories(source, searchKey);
      }
      this.setState({ lastSource: source, lastSearchKey: searchKey });
    }
  }

  render() {
    const { results, isLoading, isSortReverse, error } = this.state;
    const { source, searchKey } = this.props;

    // list = saved results or empty list
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

  // results[source][searchKey] cached?
  resultsSaved = () => {
    const { results } = this.state;
    const { source, searchKey } = this.props;
    return results && results[source] && results[source][searchKey];
  }

  // the more button in footer fetches another page of stories
  fetchMoreStories = (source, searchKey) => {
    const { results } = this.state;

    // page = current page or 0
    const isSaved = this.resultsSaved(results, source, searchKey);
    const page = isSaved ? isSaved.page : 0;

    // grab another page of stories from source
    // HN uses page numbers
    // Reddit uses ID pointers
    // both are saved in results[source][searchKey].page
    if (source === 'HN') {
      this.fetchStories(source, searchKey, page + 1);
    }
    else if (source === 'Reddit') {
      this.fetchStories(source, searchKey, page);
    }
  }

  // makes request to API
  fetchStories = (source, searchKey, page = 0) => {
    this.setState({ isLoading: true, error: null });
    axios(withSource(source)(searchKey, page))
      .then(result => this.interpretResponse(result.data))
      .catch(error => this.setState({ error, isLoading: false }))
  }
  
  // interprets response according to source API
  interpretResponse = response => {
    if (this.props.source === 'HN') {
      const { hits, page } = response;
      this.setState(this.cacheResults(hits, page));
    }
    else if (this.props.source === 'Reddit') {
      // reddit data one level deeper than HN
      const children = response.data.children.map(c => c.data);
      // uses ID to next post instead of page,
      // works the same though, just plug into url
      const after = response.data.after;
      this.setState(this.cacheResults(children, after));
    }
    // no idea how this could happen
    else {
      this.setState({ error: 'Something went wrong.'});
    }
  }

  // caches fetched results
  cacheResults = (hits, page) => prevState => {
    const { results } = prevState;
    const { source, searchKey } = this.props;

    // catch null results:
    //   null results[source] = {}
    //   null results[source][searchKey] = []
    const isSaved = this.resultsSaved(results, source, searchKey);
    const sourceResults = isSaved ? {...results}[source] : {};
    const oldHits = isSaved ? results[source][searchKey].hits : [];

    return {
      // keep old results
      results: { ...results,
        // keep old results[source]
        [source]: { ...sourceResults,
          // keep old results[source][searchKey]
          [searchKey]: { 
            // append new hits + page
            hits: [...oldHits, ...hits],
            page
          }
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

      // filter out this table row from results
      const updatedHits = hits.filter(item => item[COLUMNS[source].ID] !== id);
      return {
        results: { ...results,
          [source]: { ...results[source],
            [searchKey]: { hits: updatedHits, page }
          }
        }
      };
    });
  }
}

export default Results;