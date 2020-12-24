import React, { useEffect, useRef } from 'react';
import ExpandIcon from './icons/ExpandIcon';
import CollapseIcon from './icons/CollapseIcon';

function CreatureExpander({
  classes, active, expanded, name, expandHandler, focused,
}) {
  const buttonRef = useRef(null);
  const buttonTitle = expanded ? 'Collapse creature' : 'Expand creature';
  const buttonIcon = expanded ? <CollapseIcon /> : <ExpandIcon />;
  const buttonAriaLabel = expanded ? `collapse ${name}` : `expand ${name}`;

  useEffect(() => {
    if (focused) {
      buttonRef.current.focus();
    }
  }, [focused]);

  return (!active
    && (
    <button
      aria-label={buttonAriaLabel}
      className={`creature-expander-button ${classes}`}
      title={buttonTitle}
      onClick={expandHandler}
      type="button"
      ref={buttonRef}
    >
      {name}
      <div className="creature-expander-icon">{buttonIcon}</div>
    </button>
    )
  );
}

export default CreatureExpander;
