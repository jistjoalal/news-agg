import React, { Component } from 'react';

// a search bar
class Search extends Component {

  render() {
    const { value, onChange, onSubmit, onFocus, children } = this.props;
    return (
      <form className="search" onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={onFocus}
        />
        <button className="button-clickable" type="submit">
          {children}
        </button>
      </form>
    );
  }
}

export default Search;