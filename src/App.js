import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const isFound = searchTerm => item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  state = {
    result: null,
    searchTerm: DEFAULT_QUERY
  };
  
  setSearchTopStores = result => {
    this.setState({ result });
  }
  
  componentDidMount() {
    const { searchTerm } = this.state;
    
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(res => res.json())
      .then(result => this.setSearchTopStores(result))
      .catch(error => error)
  }
  
  onDismiss = (id) => {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { hits: updatedHits }
    });
  }
  
  onSearchChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  }
  
  render() {
    const { searchTerm, result }  = this.state;
    
    if (!result) { return null; }
    
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >
            Search:
          </Search>
          
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) =>
  <form>
    {children} <input
      type="text"
      value={value}
      onChange={onChange}
    />
  </form>

const Table = ({ list, pattern, onDismiss }) => 
  <div className="table">
    {list.filter(isFound(pattern)).map((item) => {
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

const Button = ({ onClick, className = '', children }) => 
    <button onClick={onClick} className={className}>
      {children}
    </button>

export default App;
