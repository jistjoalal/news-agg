import React, { Component } from 'react';
import { sortBy } from 'lodash';

import { withError, COLUMNS } from '../generic';
import HeaderRow from './HeaderRow';
import TableRow from './TableRow';

// table formatted for results from API request
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };
  }

  // sort table by this key
  onSort = sortKey => {
    this.selectSort(sortKey);
    this.setState({ sortKey });
  }

  // toggle reverse if column already selected
  selectSort = sortKey => {
    if (this.state.sortKey === sortKey) {
      this.setState({ isSortReverse: !this.state.isSortReverse })
    }
  }

  render() {
    const { list, onDismiss, source } = this.props;
    const { sortKey, isSortReverse } = this.state;
    // sort list
    const sortedList = sortBy(list, COLUMNS[source][sortKey.toUpperCase()])
    // toggle reverse
    const toggleSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <div className="table">
        <HeaderRow onSort={this.onSort} sortKey={sortKey}
          isSortReverse={isSortReverse} />
        {toggleSortedList.map((item, i) =>
          <TableRow key={i} source={source}
            item={item} onDismiss={onDismiss}/>
        )}
      </div>
    );
  }
}

const ResultTable = withError(Table);
export default ResultTable;