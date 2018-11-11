import React, { Component } from 'react';
import { sortBy } from 'lodash';
import classNames from 'classnames';

import { Button, SortArrow, withError } from './generic';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  DATE: list => sortBy(list, 'created_at'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

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
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const [ lg, md, sm ] = [{width: '40%'}, {width: '30%'}, {width: '10%'}];
    const sortedList = SORTS[sortKey](list);
    const toggleSortedList = isSortReverse ? sortedList.reverse() : sortedList;
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
            <i class="fa fa-trash"></i>
          </span>
        </div>
        {toggleSortedList.map(item => {
          const { url, title, created_at, objectID, num_comments, 
            points } = item;
          return (
            <div key={objectID} className="table-row">
              <span style={lg}>
                <a href={url}>{title}</a>
              </span>
              <span style={md}>
                {created_at ? created_at.slice(0,10) : '?'}
              </span>
              <span style={sm}>
                <a href={`https://news.ycombinator.com/item?id=${objectID}`}>
                  {num_comments}
                </a>
              </span>
              <span style={sm}>
                {points}
              </span>
              <span style={sm}>
                <Button
                  onClick={() => onDismiss(objectID)}
                  className="button-inline"
                >
                  Dismiss
                </Button>
              </span>
            </div>
          );
        })}
      </div>
    );
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

const ResultTable = withError(Table);

export default ResultTable;