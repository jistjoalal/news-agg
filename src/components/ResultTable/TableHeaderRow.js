import React from 'react';

import { SortArrow, Button } from '../generic';
import { COLUMN_SIZES } from './helpers';
const { lg, md, sm } = COLUMN_SIZES;

// row of Headers
const HeaderRow = ({ onClear, ...rest }) => 
  <div className="TableHeaderRow">

    {/* Data columns */}
    <DataHeader style={lg} col="Title" {...rest} />
    <DataHeader style={md} col="Date" {...rest} />
    <DataHeader style={sm} col="Comments" {...rest} />
    <DataHeader style={sm} col="Points" {...rest} />

    {/* Dismiss column */}
    <DismissHeader style={sm} onClick={onClear}/>
  </div>

// Header for columns and sorting
const DataHeader = ({ col, direction, sortKey, onSort, ...rest }) =>
  <Button
    className={`DataHeader Button inline`}
    onClick={() => onSort(col)}
    {...rest}
  >
    {col}
    <SortArrow active={col === sortKey} direction={direction} />
  </Button>

const DismissHeader = ({ ...rest }) =>
  <Button className="Button inline" {...rest}>
    <i className="fa fa-trash"></i>
  </Button>

export default HeaderRow;