import React, { Component } from 'react';
import classNames from 'classnames';

import { Button, SortArrow, withError, COLUMNS, COLUMN_SIZES,
  SORTS } from './generic';

// table formatted for results from HN API
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const { isSortReverse } = this.state;
    // toggle if reverse sort if already clicked
    const newISR = this.state.sortKey === sortKey && !isSortReverse;
    this.setState({ sortKey, isSortReverse: newISR });
  }

  // TODO: fix comments link for all sources
  render() {
    const { list, onDismiss, source } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS(source)[sortKey](list);
    const toggleSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    const [lg, md, sm] = COLUMN_SIZES;
    return (
      <div className="table">
        <div className="table-header">
          <span style={lg}>
            <Sort sortKey={'TITLE'} onSort={this.onSort}
              activeSortKey={sortKey} isSortReverse={isSortReverse}
            >
              Title
            </Sort>
          </span>
          <span style={md}>
            <Sort sortKey={'DATE'} onSort={this.onSort}
              activeSortKey={sortKey} isSortReverse={isSortReverse}
            >
              Date
            </Sort>
          </span>
          <span style={sm}>
            <Sort sortKey={'COMMENTS'} onSort={this.onSort}
              activeSortKey={sortKey} isSortReverse={isSortReverse}
            >
              Comments
            </Sort>
          </span>
          <span style={sm}>
            <Sort sortKey={'POINTS'} onSort={this.onSort}
              activeSortKey={sortKey} isSortReverse={isSortReverse}
            >
              Points
            </Sort>
          </span>
          <span style={sm}>
            <i className="fa fa-trash"></i>
          </span>
        </div>
        {toggleSortedList.map((item, i) => {
          return (
            <TableRow key={i} source={source}
              item={item} onDismiss={onDismiss}/>
          );
        })}
      </div>
    );
  }
}

const itemBySource = (source, item) => {
  let result = {};
  Object.entries(COLUMNS[source]).forEach(c =>
    result[c[0]] = item[c[1]]
  );
  return result;
}

const DateString = ({ DATE }) => {
  return new Date(DATE*1000).toDateString();
}

const TableRow = ({ item, onDismiss, source }) => {
  const { URL, TITLE, DATE, ID, COMMENTS, COMMENTS_URL,
    POINTS } = itemBySource(source, item);
  const [lg, md, sm] = COLUMN_SIZES;
  return (
    <div key={ID} className="table-row">
      <span style={lg}>
        <a href={URL}>{TITLE}</a>
      </span>
      <span style={md}>
        <DateString DATE={DATE} />
      </span>
      <span style={sm}>
        <a href={`${COMMENTS_URL}${ID}`}>
          {COMMENTS}
        </a>
      </span>
      <span style={sm}>
        {POINTS}
      </span>
      <span style={sm}>
        <Button
          onClick={() => onDismiss(ID)}
          className="button-inline"
        >
          Dismiss
        </Button>
      </span>
    </div>
  );
}
const Sort = ({ sortKey, onSort, children, activeSortKey, isSortReverse }) => {
  const active = sortKey === activeSortKey;
  const direction = isSortReverse ? 'down' : 'up';
  const sortClass = classNames('button-inline', { 'button-active': active });
  return (
    <span>
      <Button onClick={() => onSort(sortKey)} className={sortClass}>
        {children}
      </Button>
      <SortArrow show={active} direction={direction} />
    </span>
  );
}

const ResultTable = withError(Table);

export default ResultTable;