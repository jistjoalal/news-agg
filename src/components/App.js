import React, { Component } from 'react';

import '../styles/App.scss';

import Search from './Search';
import SourceSelect from './SourceSelect';
import Results from './ResultTable/Results';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: '',
      searchTerm: 'react',
      source: 'HN',
    };
  }
  
  componentDidMount() {
    this.setState(prevState => {
      return { searchKey: prevState.searchTerm }
    });
  }

  render() {
    const { searchTerm, searchKey, source }  = this.state;
    return (
      <div className="page" id="top">
        <div className="interactions">
          <SourceSelect source={source} onChange={this.onSourceChange} />

          <Search value={searchTerm} onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit} onFocus={this.onFocus} />

          <Results source={source} searchKey={searchKey} />
        </div>
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
