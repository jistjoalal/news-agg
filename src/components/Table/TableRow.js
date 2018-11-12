import React from 'react';

import { Button, COLUMN_SIZES, DateString, commentsURL,
  itemBySource } from '../generic';

const TableRow = ({ item, onDismiss, source }) => {
  const { URL, TITLE, DATE, ID, COMMENTS,
    POINTS } = itemBySource(source, item);
  const {lg, md, sm} = COLUMN_SIZES;
  return (
    <div key={ID} className="table-row">
      <span style={lg}>
        <a href={URL}>{TITLE}</a>
      </span>

      <span style={md}>
        <DateString DATE={DATE} />
      </span>

      <span style={sm}>
        <a href={commentsURL(item, source)}>{COMMENTS}</a>
      </span>

      <span style={sm}>
        {POINTS}
      </span>

      <span style={sm}>
        <Button onClick={() => onDismiss(ID)} className="button-inline">
          Dismiss
        </Button>
      </span>
    </div>
  );
}

export default TableRow;