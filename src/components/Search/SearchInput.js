import React from 'react';

// a search bar
const SearchInput = ({ value, onChange, onSubmit, onFocus }) => 
  <form className="SearchInput" onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      placeholder="react"
    />
  </form>

export default SearchInput;