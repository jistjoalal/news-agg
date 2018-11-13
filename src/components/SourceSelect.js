import React from 'react';

import { SOURCES } from './generic';

const SourceSelect = ({ source, onChange }) => 
  <div className="SourceSelect">
  
    {/* radio button for each source */}
    {SOURCES.map(s =>
      <span key={s} className="SourceSelect-radio">
        <input type="radio" value={s}
          checked={source === s} onChange={onChange}
        />
          {s}
      </span>
    )}
  </div>

export default SourceSelect;