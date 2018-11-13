import React, { Component } from 'react';
import { sortBy } from 'lodash';

import { withError, COLUMNS } from '../generic';
import TableHeaderRow from './TableHeaderRow';
import TableRow from './TableRow';

// table formatted for results from API request
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: 'Points',
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
      <div className="Table">
        <TableHeaderRow onSort={this.onSort}
          sortKey={sortKey} direction={isSortReverse} />
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