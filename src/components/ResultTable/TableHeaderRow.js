import React from 'react';

import { SortArrow, Button, buttonStyles } from '../generic';
import { COLUMN_HEADERS, COLUMN_SIZES } from './helpers';

// row of Headers
const HeaderRow = ({ onSort, onClear, sortKey, direction }) => 
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
    <Button style={COLUMN_SIZES.sm} className="Button inline"
      onClick={onClear}>
      <i className="fa fa-trash"></i>
    </Button>
  </div>

// Header for columns and sorting
const Header = ({ active, onClick, name, direction, size }) => {
  return (
    <span style={size} className={`TableHeader${active? ' active' : ''}`}>
      <Button onClick={onClick} className={buttonStyles(active)}>
        {name} <SortArrow show={active} direction={direction} />
      </Button>
    </span>
  );
}

export default HeaderRow;