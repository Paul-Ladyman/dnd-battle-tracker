import React from 'react';
import ExpandIcon from './icons/ExpandIcon';
import CollapseIcon from './icons/CollapseIcon';

function CreatureExpander({active, expanded, name, expandHandler}) {
  console.log('>>> expanded', expanded);
  const buttonTitle = expanded ? 'Collapse creature' : 'Expand creature';
  const buttonIcon = expanded ? <CollapseIcon /> : <ExpandIcon />;
  const buttonAriaLabel = expanded ? `collapse ${name}` : `expand ${name}`;

  return (!active && 
    <button
      aria-label={buttonAriaLabel}
      className="expand-creature-button"
      title={buttonTitle}
      onClick={expandHandler}>
        {buttonIcon}
    </button>
  );
     
}

export default CreatureExpander;