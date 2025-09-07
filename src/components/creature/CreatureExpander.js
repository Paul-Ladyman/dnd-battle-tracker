import React, { useLayoutEffect, useRef } from 'react';
import ExpandIcon from '../icons/ExpandIcon';
import CollapseIcon from '../icons/CollapseIcon';
import InitiativeIcon from '../icons/InitiativeIcon';

function CreatureExpander({
  classes, active, expanded, name, expandHandler, focused,
}) {
  const buttonRef = useRef(null);
  const buttonTitle = expanded ? 'Collapse creature' : 'Expand creature';
  const buttonIcon = expanded ? <CollapseIcon /> : <ExpandIcon />;
  const buttonAriaLabel = expanded ? `collapse ${name}` : `expand ${name}`;

  const baseClass = 'creature-expander-button';
  const modifierClass = active ? `${baseClass}__disabled` : '';
  const className = `${baseClass} ${modifierClass} ${classes}`;

  useLayoutEffect(() => {
    if (focused) {
      buttonRef.current.focus({ preventScroll: true });
    }
  }, [focused]);

  const onClick = () => {
    if (!active) {
      expandHandler();
    }
  };

  return (
    <button
      aria-label={buttonAriaLabel}
      className={className}
      title={buttonTitle}
      onClick={onClick}
      type="button"
      ref={buttonRef}
      aria-disabled={active}
      aria-expanded={expanded}
    >
      {name}
      {!active && <div className="creature-expander-icon">{buttonIcon}</div>}
      {active && <InitiativeIcon className="creature-expander-icon" title="Active creature" />}
    </button>
  );
}

export default CreatureExpander;
