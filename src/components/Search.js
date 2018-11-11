import React, { Component } from 'react';

// a search bar
class Search extends Component {
  componentDidMount() {
    if (this.input) { this.input.focus(); }
  }

  render() {
    const { value, onChange, onSubmit, onFocus, children } = this.props;
    return (
      <form className="search" onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          ref={el => this.input = el}
        />
        <button className="button-clickable" type="submit">
          {children}
        </button>
      </form>
    );
  }
}

export default Search;