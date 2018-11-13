import React, { Component } from 'react';
import axios from 'axios';

import { COLUMNS, withSource } from '../generic';
import Table from './Table';
import Footer from './Footer';

//TODO: seperate out API specific stuff
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
    this.setState({ lastSource: 'fetch pls' });
  }

  // need to fetch results?
  componentDidUpdate() {
    const { lastSource, lastSearchKey, results, isLoading } = this.state;
    const { source, searchKey } = this.props;
    // change of source or searchKey & !already fetching
    if ((lastSource !== source || searchKey !== lastSearchKey)
      && !isLoading)
    {
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

        <Footer isLoading={isLoading}
          fetchMore={() => this.fetchMoreStories()} />
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
  fetchMoreStories = () => {
    const { results } = this.state;
    const { source, searchKey } = this.props;

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
  fetchStories = () => {
    const { results } = this.state;
    const { source, searchKey } = this.props;
    
    // next page or default to 0
    const page = this.resultsSaved() ? results[source][searchKey].page : 0;

    // loading icon, clear error
    this.setState({ isLoading: true, error: null });

    // make request
    axios(withSource(source)(searchKey, page))
      .then(result => this.interpretResponse(result.data))
      .catch(error => this.setState({ error, isLoading: false }))
  }
  
  // interprets response according to source API
  interpretResponse = response => {
    if (this.state.lastSource === 'HN') {
      const { hits, page } = response;
      this.cacheResults(hits, page);
    }
    else if (this.state.lastSource === 'Reddit') {
      // reddit data one level deeper than HN
      const children = response.data.children.map(c => c.data);
      // uses ID to next post instead of page,
      // works the same though, just plug into url
      const after = response.data.after;
      this.cacheResults(children, after);
    }
    // no idea how this could happen
    else {
      this.setState({ error: 'Something went wrong.'});
    }
  }

  // caches fetched results
  cacheResults = (hits, page) => {
      this.setState(({ results, lastSource, lastSearchKey }) => {
      // catch null results (cant spread null):
      //   null results[source] = {}
      //   null results[source][searchKey] = {}
      //   null results[source][searchKey].hits = []
      const sourceResults = results && results[lastSource] ?
        {...results}[lastSource] : {};
      const searchResults = sourceResults && sourceResults[lastSearchKey] ?
        {...sourceResults}[lastSearchKey] : {};
      const oldHits = searchResults.hits || [];
      return {
        // keep old results (other sources)
        results: { ...results,
          // keep old results[source] (other searchKeys)
          [lastSource]: { ...sourceResults,
            [lastSearchKey]: {
              // append new hits + page
              hits: [...oldHits, ...hits],
              page
            }
          }
        },
        isLoading: false
      }
    })
  }

  // remove hit from result list
  onDismiss = id => this.setState(({ results, lastSource, lastSearchKey }) => {
    const { hits, page } = results[lastSource][lastSearchKey];

    // filter out this table row from results
    const updatedHits = hits.filter(item =>
      item[COLUMNS[lastSource].ID] !== id);
    return {
      results: { ...results,
        [lastSource]: { ...results[lastSource],
          [lastSearchKey]: { hits: updatedHits, page }
        }
      }
    };
  })
}

export default Results;