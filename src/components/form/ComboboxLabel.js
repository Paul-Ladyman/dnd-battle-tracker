import React from 'react';

export default function ComboboxLabel(expanded, label, dropdownId, onClick) {
  const style = {
    transform: expanded ? 'rotate(180deg) translate(0, -3px)' : undefined,
    color: '#822000',
    forcedColorAdjust: 'auto',
    marginLeft: '5px',
  };

  return (
    <>
      Notes
      <button
        className="combobox-dropdown-expander"
        type="button"
        tabIndex="-1"
        aria-label={label}
        aria-expanded={expanded}
        aria-controls={dropdownId}
        onClick={onClick}
      >
        <svg width="18" height="16" aria-hidden="true" focusable="false" style={style}>
          <polygon className="arrow" strokeWidth="0" fillOpacity="0.75" fill="currentColor" points="3,6 15,6 9,14" />
        </svg>
      </button>
    </>
  );
}
