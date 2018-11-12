import React from 'react';

const SOURCES = ['HN', 'Reddit'];

const SourceSelect = ({ source, onChange }) => 
  <div className="SourceSelect">
    {SOURCES.map(s =>
      <span key={s} className="SourceSelect-radio">
        <input className="SourceSelect-radio"
          type="radio" value={s}
          checked={source === s}
          onChange={onChange} />{s}
      </span>
    )}
  </div>

export default SourceSelect;