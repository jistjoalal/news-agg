import React, { Component } from 'react';

import '../styles/App.scss';

//TODO: refactor search w/ index.js as its own component like ResultTable
//TODO: -then factor out helpers
import Search from './Search/SearchInput';
import SourceSelect from './Search/SourceSelect';

import ResultTable from './ResultTable';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: 'react',
      source: 'HN',
    };
  }

  render() {
    const { searchKey, source }  = this.state;
    return (
      <div className="App" id="top">
        <div className="Search">
          <SourceSelect source={source} onChange={this.onSourceChange} />

          <Search value={searchKey} onChange={this.onSearchChange}
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
  onSearchChange = ({ target }) => {
    console.log(target.value)
    if (target.value !== '') {
      this.setState({ searchKey: target.value });
    }
  }

  // clear search input on focus
  onFocus = () => {
    this.setState({searchKey: ''});
  }
}

export default App;
