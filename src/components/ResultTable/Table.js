import React, { Component } from 'react';
import { sortBy } from 'lodash';

import { withError, LoadingIcon } from '../generic';
import { COLUMNS } from './helpers';

import TableHeaderRow from './TableHeaderRow';
import TableRow from './TableRow';

//TODO: make placeholder table more dead (still responds to clicks)
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
    <TableRow key={i} source={'HN'} onDismiss={() => true}
      item={{
        title: <LoadingIcon isLoading={true}/>,
        created_at_i: 60*(new Date().getTimezoneOffset()),
        num_comments: 42,
        points: 1337,
        objectID: i,
        url: ""
      }}
    />
  );
}

export default withError(Table);