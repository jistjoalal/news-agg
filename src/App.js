import React, { Component } from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '10';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  DATE: list => sortBy(list, 'created_at'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

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

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.updateSearchTopStories = this.updateSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
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
          >
            Search
          </Search>
          <TableWithError
            list={list}
            onDismiss={this.onDismiss}
            isSortReverse={isSortReverse}
            error={error}
          />
        </div>
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
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

    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
      &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    axios(url)
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error, isLoading: false }))
  }
  
  // stores response in state.results, appending to existing hits
  setSearchTopStories = response => {
    const { hits, page } = response;
    this.setState(this.updateSearchTopStories(hits, page));
  }

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

// a search bar
class Search extends Component {
  componentDidMount() {
    if (this.input) { this.input.focus(); }
  }
  render() {
    const { value, onChange, onSubmit, children } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={el => this.input = el}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
}

// table formatted for results from HN API
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const { isSortReverse } = this.state;
    // toggle if reverse sort if already clicked
    const newISR = this.state.sortKey === sortKey && !isSortReverse;
    this.setState({ sortKey, isSortReverse: newISR });
  }

  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const [ lg, md, sm ] = [{width: '40%'}, {width: '30%'}, {width: '10%'}];
    const sortedList = SORTS[sortKey](list);
    const toggleSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <div className="table">
        <div className="table-header">
          <span style={lg}>
            <Sort sortKey={'TITLE'} onSort={this.onSort}
              activeSortKey={sortKey} isSortReverse={isSortReverse}
            >
              Title
            </Sort>
          </span>
          <span style={md}>
            <Sort sortKey={'DATE'} onSort={this.onSort}
              activeSortKey={sortKey} isSortReverse={isSortReverse}
            >
              Date
            </Sort>
          </span>
          <span style={sm}>
            <Sort sortKey={'COMMENTS'} onSort={this.onSort}
              activeSortKey={sortKey} isSortReverse={isSortReverse}
            >
              Comments
            </Sort>
          </span>
          <span style={sm}>
            <Sort sortKey={'POINTS'} onSort={this.onSort}
              activeSortKey={sortKey} isSortReverse={isSortReverse}
            >
              Points
            </Sort>
          </span>
          <span style={sm}>
            Archive
          </span>
        </div>
        {toggleSortedList.map(item => {
          const { url, title, created_at, objectID, num_comments, 
            points } = item;
          return (
            <div key={objectID} className="table-row">
              <span style={lg}>
                <a href={url}>{title}</a>
              </span>
              <span style={md}>
                {created_at.slice(0,10)}
              </span>
              <span style={sm}>
                <a href={`https://news.ycombinator.com/item?id=${objectID}`}>
                  {num_comments}
                </a>
              </span>
              <span style={sm}>
                {points}
              </span>
              <span style={sm}>
                <Button
                  onClick={() => onDismiss(objectID)}
                  className="button-inline"
                >
                  Dismiss
                </Button>
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

const Sort = ({ sortKey, onSort, children, activeSortKey, isSortReverse }) => {
  const active = sortKey === activeSortKey;
  const direction = isSortReverse ? 'down' : 'up';
  const sortClass = classNames('button-inline', { 'button-active': active });
  return (
    <span>
      <Button onClick={() => onSort(sortKey)} className={sortClass}>
        {children}
      </Button>
      <ArrowWithNull show={active} direction={direction} />
    </span>
  );
}


const Arrow = ({ direction }) =>
  <i class={`fa fa-arrow-${direction}`}></i>

// a button w/ a click listener
const Button = ({ onClick, className = '', children }) => 
    <button onClick={onClick} className={className}>
      {children}
    </button>

const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ?
    <i className="fa fa-spinner fa-spin fa-3x"></i>
  : <Component { ...rest } />

const withError = Component => ({ error, ...rest }) =>
  error ?
    <div className="interactions">
      <p>Something went wrong.</p>
    </div>
  : <Component { ...rest } />

const withNull = Component => ({ show, ...rest }) =>
  show ?
    <Component { ...rest } />
  : null;

const ButtonWithLoading = withLoading(Button);
const TableWithError = withError(Table);
const ArrowWithNull = withNull(Arrow);

export default App;

export { Button, Search, Table, SORTS };