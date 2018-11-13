import React from 'react';

import { COLUMN_HEADERS, COLUMN_SIZES, SortArrow, Button,
  buttonStyles } from '../generic';

const style = "TableHeader";

// row of Headers
const HeaderRow = ({ onSort, sortKey, direction }) => 
  <div className="TableHeaderRow">

    {/* Header for each column */}
    {Object.entries(COLUMN_HEADERS).map(c => {
      const [name, size] = c;
      const active = sortKey === name;
      return (
        <Header key={name} onClick={() => onSort(name)} active={active}
          direction={direction} size={size} name={name} />
      );
    })}

    {/* Dismiss column */}
    <span style={COLUMN_SIZES.sm} className={style}>
      <i className="fa fa-trash"></i>
    </span>
  </div>

// Header for columns and sorting
const Header = ({ active, onClick, name, direction, size }) => {
  return (
    <span style={size} className={`${style}${active? ' active' : ''}`}>
      <Button onClick={onClick} className={buttonStyles(active)}>
        {name} <SortArrow show={active} direction={direction} />
      </Button>
    </span>
  );
}

export default HeaderRow;