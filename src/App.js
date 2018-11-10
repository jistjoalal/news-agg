import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '10';

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
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }
  
  render() {
    const { searchTerm, results, searchKey, error, isLoading }  = this.state;
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
          { error ?
            <div className="interactions">
              <p>Something went wrong.</p>
            </div>
            
            : <Table
              list={list}
              onDismiss={this.onDismiss}
            />
          }
        </div>
        <div className="interactions">
          {isLoading ?
            <Loading />
          : <Button onClick={() =>
              this.fetchSearchTopStories(searchKey, page + 1)}>
            More
            </Button>
          }
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
      .catch(error => this.setState({ error }))
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
const Table = ({ list, onDismiss }) => 
  <div className="table">
    {list.map(item => {
      const [ lg, md, sm ] = [{width: '40%'}, {width: '30%'}, {width: '10%'}];
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

// a button w/ a click listener
const Button = ({ onClick, className = '', children }) => 
    <button onClick={onClick} className={className}>
      {children}
    </button>

const Loading = () =>
  <i class="fa fa-spinner fa-spin fa-3x"></i>;

export default App;

export { Button, Search, Table };