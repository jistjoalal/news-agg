import React, { Component } from 'react';

import '../styles/App.scss';

//TODO: refactor search w/ index.js as its own component like ResultTable
//TODO: -then factor out helpers
//TODO: search on input change
//TODO: fetch on source click if need (after delete all)
import Search from './Search/SearchInput';
import SourceSelect from './Search/SourceSelect';

import ResultTable from './ResultTable';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: 'react',
      searchTerm: 'react',
      source: 'HN',
    };
  }

  render() {
    const { searchTerm, searchKey, source }  = this.state;
    return (
      <div className="App" id="top">
        <div className="Search">
          <SourceSelect source={source} onChange={this.onSourceChange} />

          <Search value={searchTerm} onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit} onFocus={this.onFocus} />
        </div>

        <ResultTable source={source} searchKey={searchKey} />
      </div>
    );
  }

  // control source input
  onSourceChange = event => {
    this.setState({ source: event.target.value });
  }
  
  // control search input
  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  }

  // submit search input
  onSearchSubmit = event => {
    event.preventDefault();
    this.setState(prevState => {
      return { searchKey: prevState.searchTerm }
    });
  }

  // clear search input on focus
  onFocus = () => {
    this.setState({searchTerm: ''});
  }
}

export default App;
