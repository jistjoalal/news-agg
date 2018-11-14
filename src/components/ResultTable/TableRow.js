import React from 'react';

import { COLUMN_SIZES, TABLE_CELLS, itemBySource } from './helpers';
const { TSpan, TLink, TButton, TDate } = TABLE_CELLS;
const {lg, md, sm} = COLUMN_SIZES;

// Row of fetched results w/ dismiss button
const TableRow = ({ onDismiss, ...rest }) => {
  
  // get column data
  const { URL, TITLE, DATE, ID, COMMENTS, COMMENTS_URL,
    POINTS } = itemBySource({...rest});

  return (
    <div key={ID} className="TableRow">
      <TLink style={lg} href={URL}>
        {TITLE}
      </TLink>

      <TDate style={md}>
        {DATE}
      </TDate>

      <TLink style={sm} href={COMMENTS_URL}>
        {COMMENTS}
      </TLink>

      <TSpan style={sm}>
        {POINTS} 
      </TSpan>

      <TButton style={sm} onClick={() => onDismiss(ID)}>
        Dismiss
      </TButton>
    </div>
  );
}

export default TableRow;