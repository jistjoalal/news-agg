import React, { Component } from 'react';
import axios from 'axios';

import { unpackResponse, sourceNextPage, withSource,
  COLUMNS } from './helpers';

import Table from './Table';
import Footer from './Footer';

class ResultTable extends Component {
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
    if ((lastSource !== source || searchKey !== lastSearchKey) && !isLoading) {
      // results not yet cached
      if (!this.resultsSaved(results, source, searchKey)) {
        this.fetchStories();
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
      <div className="ResultTable">
        <Table list={list} onDismiss={this.onDismiss} onClear={this.dismissAll}
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
    const { results, lastSource } = this.state;
    const { source, searchKey } = this.props;

    // page = current page or 0
    const isSaved = this.resultsSaved(results, source, searchKey);
    const page = isSaved ? isSaved.page : 0;

    // grab another page of stories from source
    this.fetchStories(sourceNextPage(lastSource, page));
  }

  // makes request to API
  // - optional page parameter for fetching next pages of results
  fetchStories = (page = 0) => {
    const { source, searchKey } = this.props;

    // loading icon, clear error
    this.setState({ isLoading: true, error: null });

    // make request
    axios(withSource(source)(searchKey, page))
      .then(res => this.onResponse(res))
      .catch(error => this.setState({ error, isLoading: false }))
  }
  
  // interprets response according to source API
  onResponse = ({ data }) => {
    this.cacheResults(unpackResponse(this.state.lastSource, data));
  }

  // caches fetched results
  cacheResults = ({ hits, page }) => {
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
  })}

  dismissAll = () => this.setState(({ results, lastSource, lastSearchKey }) => {
    return {
      results: { ...results,
        [lastSource]: {...results[lastSource],
          [lastSearchKey]: null
        }
      }
    }
  })

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

export default ResultTable;