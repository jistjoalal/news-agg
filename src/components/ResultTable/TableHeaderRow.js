import React from 'react';

import { COLUMN_HEADERS, COLUMN_SIZES, SortArrow, Button,
  buttonStyles } from '../generic';

// row of Headers
const HeaderRow = ({ onSort, sortKey, isSortReverse }) => 
  <div className="table-header">
    {Object.entries(COLUMN_HEADERS).map(c => {
      const [name, size] = c;
      return (
        <Header key={name} sortKey={name} onSort={onSort} activeSortKey={sortKey}
          isSortReverse={isSortReverse} size={size} name={name} />
      );
    })}
    <span style={COLUMN_SIZES.sm} className="Header">
      <i className="fa fa-trash"></i>
    </span>
  </div>

// Header for columns and sorting stories
const Header = ({ sortKey, activeSortKey, onSort, name, isSortReverse, size }) => {
  const active = sortKey === activeSortKey;
  return (
    <span style={size} className="Header">
      <Button onClick={() => onSort(sortKey)} className={buttonStyles(active)}>
        {name} <SortArrow show={active} direction={isSortReverse} />
      </Button>
    </span>
  );
}

export default HeaderRow;