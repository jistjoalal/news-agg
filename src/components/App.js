import React, { Component } from 'react';

import '../styles/App.scss';

import Search from './Search';
import SourceSelect from './Search/SourceSelect';
import ResultTable from './ResultTable';

//TODO: fetch by active column (goes by points now (default for both APIs))
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: '',
      source: 'HN',
    };
  }

  render() {
    const { searchKey, source }  = this.state;
    
    // search key defaults to react
    const s = searchKey === '' ? 'react' : searchKey;
    return (
      <div className="App" id="top">
        <div className="Search">
          <SourceSelect source={source} onChange={this.onSourceChange} />

          <Search value={searchKey} onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit} onFocus={this.onFocus} />
        </div>

        <ResultTable source={source} searchKey={s} />
      </div>
    );
  }

  // control source input
  onSourceChange = event => {
    this.setState({ source: event.target.value });
  }
  
  // control search input
  onSearchChange = ({ target }) => {
    this.setState({ searchKey: target.value });
  }

  // clear search input on focus
  onFocus = () => {
    this.setState({searchKey: ''});
  }
}

export default App;
