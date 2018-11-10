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
  AUTHOR: list => sortBy(list, 'author'),
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
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStores = this.setSearchTopStores.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSort = this.onSort.bind(this);
  }
  
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }
  
  render() {
    const { searchTerm, results, searchKey, error, isLoading,
      sortKey, isSortReverse }  = this.state;
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
            sortKey={sortKey}
            onSort={this.onSort}
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

  onSort(sortKey) {
    const { isSortReverse } = this.state;
    // toggle if reverse sort if already clicked
    const newISR = this.state.sortKey === sortKey && !isSortReverse;
    this.setState({ sortKey, isSortReverse: newISR });
  }
  
  // control search input
  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  }

  // submit search input
  onSearchSubmit = e => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    e.preventDefault();
  }

  // remove hit from result list
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

  // is result for searchTerm cached already?
  needsToSearchTopStories = searchTerm => !this.state.results[searchTerm];

  // makes request to HN API
  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });

    const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}
      &${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    axios(url)
      .then(result => this.setSearchTopStores(result.data))
      .catch(error => this.setState({ error, isLoading: false }))
  }
  
  // stores response in state.results, appending to existing hits
  setSearchTopStores = response => {
    const { hits, page } = response;
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({ 
      results: { 
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false
    });
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
const Table = ({
  list, onDismiss, sortKey = 'NONE', onSort, isSortReverse
}) => {
  const [ lg, md, sm ] = [{width: '40%'}, {width: '30%'}, {width: '10%'}];
  const sortedList = SORTS[sortKey](list);
  const toggleSortedList = isSortReverse ? sortedList.reverse() : sortedList;
  return (
    <div className="table">
      <div className="table-header">
        <span style={lg}>
          <Sort sortKey={'TITLE'} onSort={onSort} activeSortKey={sortKey}
            isSortReverse={isSortReverse}
          >
            Title
          </Sort>
        </span>
        <span style={md}>
          <Sort sortKey={'AUTHOR'} onSort={onSort} activeSortKey={sortKey}
            isSortReverse={isSortReverse}
          >
            Author
          </Sort>
        </span>
        <span style={sm}>
          <Sort sortKey={'COMMENTS'} onSort={onSort} activeSortKey={sortKey}
            isSortReverse={isSortReverse}
          >
            Comments
          </Sort>
        </span>
        <span style={sm}>
          <Sort sortKey={'POINTS'} onSort={onSort} activeSortKey={sortKey}
            isSortReverse={isSortReverse}
          >
            Points
          </Sort>
        </span>
        <span style={sm}>
          Archive
        </span>
      </div>
      {toggleSortedList.map(item => {
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
  );
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