import React, { useState } from 'react';
import Shortcuts from './Shortcuts';

export default function Help({ hotkeysToDisplay }) {
  const [expanded, setExpanded] = useState(false);
  const display = expanded ? 'block' : 'none';

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const iconStyle = {
    transform: expanded ? 'rotate(0deg) translate(0, -2px)' : 'rotate(-90deg) translate(0, -2px)',
    color: '#822000',
    forcedColorAdjust: 'auto',
  };

  return (
    <dl>
      <dt>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="keyboard-shortcuts"
          onClick={toggleExpanded}
          className="button__help"
        >
          <svg width="18" height="16" aria-hidden="true" focusable="false" style={iconStyle}>
            <polygon className="arrow" strokeWidth="0" fillOpacity="0.75" fill="currentColor" points="3,6 15,6 9,14" />
          </svg>
          Keyboard shortcuts
        </button>
      </dt>
      <dd>
        <Shortcuts display={display} hotkeysToDisplay={hotkeysToDisplay} />
      </dd>
    </dl>
  );
}
