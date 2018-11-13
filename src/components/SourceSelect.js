import React from 'react';

import { SOURCES } from './generic';

const SourceSelect = ({ source, onChange }) => {
  return (
    <div className="SourceSelect">
    
      {/* radio button for each source */}
      {SOURCES.map(s =>
        <label key={s}
          className={`SourceSelectRadio${source === s ? ' active' : ''}`}
        >
          <input type="radio" value={s}
            checked={source === s} onChange={onChange}
          />
            {s}
        </label>
      )}
    </div>
  );
} 

export default SourceSelect;