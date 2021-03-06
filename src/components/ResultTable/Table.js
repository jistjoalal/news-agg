import React, { Component } from 'react';
import { sortBy } from 'lodash';

import { withError } from '../generic';
import { COLUMNS } from './helpers';

import TableHeaderRow from './TableHeaderRow';
import { TableRow, TableRowPlaceholder } from './TableRow';

// table formatted for results from API request
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'Points',
      isSortReverse: true,
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

  tableRows = () => {
    const { list, onDismiss, source } = this.props;
    const { sortKey, isSortReverse } = this.state;
    // sort list
    const sortedList = sortBy(list, COLUMNS[source][sortKey.toUpperCase()])
    // toggle reverse
    const toggleSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    
    // show line for empty list
    return list.length === 0 ? <PlaceholderTable />
    : toggleSortedList.map((item, i) =>
        <TableRow key={i} source={source}
          item={item} onDismiss={onDismiss}/>
    )
  }

  render() {
    const { onClear } = this.props;
    const { sortKey, isSortReverse } = this.state;
    return (
      <div className="Table">
        <TableHeaderRow onSort={this.onSort} onClear={onClear}
          sortKey={sortKey} direction={isSortReverse} />
        <this.tableRows />
        <TableHeaderRow onSort={this.onSort}
          sortKey={sortKey} direction={isSortReverse} />
      </div>
    );
  }
}

// for an empty table
const PlaceholderTable = () => {
  return [...Array(25).keys()].map(i =>
    <TableRowPlaceholder key={i} />
  );
}

export default withError(Table);