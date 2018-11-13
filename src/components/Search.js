import React from 'react';

// a search bar
const Search = ({ value, onChange, onSubmit, onFocus }) => 
  <form className="Search" onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
    />
    <button className="Button clickable" type="submit">
      Search
    </button>
  </form>

export default Search;