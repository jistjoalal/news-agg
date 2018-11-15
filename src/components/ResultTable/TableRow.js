import React from 'react';

import { LoadingIcon } from '../generic';
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

const TableRowPlaceholder = i =>
  <div key={i} className="TableRow">
    <LoadingIcon isLoading={true} />
  </div>

export { TableRow, TableRowPlaceholder };
export default TableRow;