import React, { useEffect, useRef } from 'react';
import ExpandIcon from './icons/ExpandIcon';
import CollapseIcon from './icons/CollapseIcon';
import ActiveCreatureIcon from './icons/ActiveCreatureIcon';

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

  return (
    <button
      aria-label={buttonAriaLabel}
      className={`creature-expander-button ${classes}`}
      title={buttonTitle}
      onClick={expandHandler}
      type="button"
      ref={buttonRef}
      disabled={active}
    >
      <div>{name}</div>
      {!active && <div className="creature-expander-icon">{buttonIcon}</div>}
      {active && <ActiveCreatureIcon className="creature-expander-icon" />}
    </button>
  );
}

export default CreatureExpander;
