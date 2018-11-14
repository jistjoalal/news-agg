import React from 'react';

import { Button, COLUMN_SIZES, DateString, commentsURL,
  itemBySource } from '../generic';

// Row of fetched results w/ dismiss button
const TableRow = ({ onDismiss, ...rest }) => {
  
  // get column size + data
  const {lg, md, sm} = COLUMN_SIZES;
  const { URL, TITLE, DATE, ID, COMMENTS,
    POINTS } = itemBySource({...rest}),
    COMMENTS_URL = commentsURL({...rest});

  return (
    <div key={ID} className="TableRow">
      <span style={lg}>
        <a href={URL}>{TITLE}</a>
      </span>

      <span style={md}>
        <DateString DATE={DATE} />
      </span>

      <span style={sm}>
        <a href={COMMENTS_URL}>{COMMENTS}</a>
      </span>

      <span style={sm}>
        {POINTS}
      </span>

      <span style={sm} className="Dismiss">
        <Button onClick={() => onDismiss(ID)} className="Button inline">
          Dismiss
        </Button>
      </span>
    </div>
  );
}

export default TableRow;