import React from 'react';

import { COLUMN_HEADERS, SortArrow, Button, buttonStyles } from '../generic';

const HeaderRow = ({ onSort, sortKey, isSortReverse }) => 
  <div className="table-header">
    {Object.entries(COLUMN_HEADERS).map(c =>
      <Header key={c[0]} sortKey={c[0]} onSort={onSort} activeSortKey={sortKey}
        isSortReverse={isSortReverse} size={c[1]} name={c[0]} />
    )}
  </div>

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