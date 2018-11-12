import React, { Component } from 'react';
import classNames from 'classnames';
import { sortBy } from 'lodash';

import { Button, SortArrow, withError, COLUMNS,
  COLUMN_SIZES } from './generic';

// TODO: refactor
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

  render() {
    const { list, onDismiss, source } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS(source)[sortKey](list);
    const toggleSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    const [lg, md, sm] = COLUMN_SIZES;
    return (
      <div className="table">
        <div className="table-header">
          <ColumnHeader name="Title" size={lg} onSort={this.onSort}
            sortKey={sortKey} isSortReverse={isSortReverse} />
          <ColumnHeader name="Date" size={md} onSort={this.onSort}
            sortKey={sortKey} isSortReverse={isSortReverse} />
          <ColumnHeader name="Comments" size={sm} onSort={this.onSort}
            sortKey={sortKey} isSortReverse={isSortReverse} />
          <ColumnHeader name="Points" size={sm} onSort={this.onSort}
            sortKey={sortKey} isSortReverse={isSortReverse} />
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

const TableRow = ({ item, onDismiss, source }) => {
  const { URL, TITLE, DATE, ID, COMMENTS,
    POINTS } = itemBySource(source, item);
  const [lg, md, sm] = COLUMN_SIZES;
  const COMMENTS_URL = commentsURL(item, source);
  return (
    <div key={ID} className="table-row">
      <span style={lg}><a href={URL}>{TITLE}</a></span>
      <span style={md}><DateString DATE={DATE} /></span>
      <span style={sm}><a href={COMMENTS_URL}>{COMMENTS}</a></span>
      <span style={sm}>{POINTS}</span>
      <span style={sm}>
        <Button onClick={() => onDismiss(ID)} className="button-inline">
          Dismiss
        </Button>
      </span>
    </div>
  );
}

const ColumnHeader = ({ size, name, onSort, sortKey, isSortReverse }) =>
  <span style={size}>
    <Sort sortKey={name} onSort={onSort} activeSortKey={sortKey}
      isSortReverse={isSortReverse}
    >{name}
    </Sort>
  </span>

const itemBySource = (source, item) => {
  let result = {};
  Object.entries(COLUMNS[source]).forEach(c => {
    result[c[0]] = item[c[1]];
  });
  return result;
}

const DateString = ({ DATE }) => {
  return new Date(DATE*1000).toDateString();
}

const commentsURL = (item, source) => {
  console.log(item.objectID);
  switch (source) {
    default: return `https://news.ycombinator.com/item?id=${item.objectID}`
    case 'Reddit':
      const base = 'https://www.reddit.com/';
      return `${base}${item.subreddit_name_prefixed}/comments/${item.id}`;
  }
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

const SORTS = source => {
  return {
    NONE: list => list,
    Title: list => sortBy(list, COLUMNS[source].TITLE),
    Date: list => sortBy(list, COLUMNS[source].DATE),
    Comments: list => sortBy(list, COLUMNS[source].COMMENTS),
    Points: list => sortBy(list, COLUMNS[source].POINTS),
  }
};


const ResultTable = withError(Table);
export default ResultTable;