import React from 'react';
import ExpandIcon from './icons/ExpandIcon';
import CollapseIcon from './icons/CollapseIcon';

function CreatureExpander({
  classes, active, expanded, name, expandHandler,
}) {
  const buttonTitle = expanded ? 'Collapse creature' : 'Expand creature';
  const buttonIcon = expanded ? <CollapseIcon /> : <ExpandIcon />;
  const buttonAriaLabel = expanded ? `collapse ${name}` : `expand ${name}`;

  return (!active
    && (
    <button
      aria-label={buttonAriaLabel}
      className={`creature-expander-button ${classes}`}
      title={buttonTitle}
      onClick={expandHandler}
      type="button"
    >
      {name}
      <div className="creature-expander-icon">{buttonIcon}</div>
    </button>
    )
  );
}

export default CreatureExpander;
