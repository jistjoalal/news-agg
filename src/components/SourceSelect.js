import React from 'react';

import { SOURCES, SourceIcon } from './generic';

const SourceSelect = ({ source, onChange }) => {
  return (
    <div className="SourceSelect">
    
      {/* radio button for each source */}
      {SOURCES.map(s =>
        <label key={s}
          // prevent click-drag highlight b/c its annoying
          onMouseDown={e => e.preventDefault()}
          className={`SourceSelectRadio${source === s ? ' active' : ''}`}
        >
          <input type="radio" value={s}
            checked={source === s} onChange={onChange}
          />
            <SourceIcon source={s} />
        </label>
      )}
    </div>
  );
} 

export default SourceSelect;