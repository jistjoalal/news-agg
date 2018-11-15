import React from 'react';

import { COLUMN_SIZES, TABLE_CELLS, itemBySource } from './helpers';
const { TSpan, TLink, TButton, TDate, TTitle } = TABLE_CELLS;
const {lg, md, sm} = COLUMN_SIZES;

// Row of fetched results w/ dismiss button
const TableRow = ({ onDismiss, ...rest }) => {
  
  // get column data
  const { URL, TITLE, DATE, ID, COMMENTS, COMMENTS_URL,
    POINTS } = itemBySource({...rest});

  return (
    <div key={ID} className="TableRow">
      <TTitle style={lg} href={URL}>
        {TITLE}
      </TTitle>

      <TDate style={md} className="TableMobileExclude">
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