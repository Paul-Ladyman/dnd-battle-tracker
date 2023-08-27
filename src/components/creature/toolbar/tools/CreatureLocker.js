import React from 'react';
import LockedIcon from '../../../icons/LockedIcon';

function CreatureLocker({ creature, toggleCreatureLock }) {
  const { locked, name, id } = creature;
  const text = locked ? 'Unlock' : 'Lock';
  const buttonAriaLabel = locked ? `Unlock ${name}` : `Lock ${name}`;
  const ariaPressed = locked ? 'true' : 'false';
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const mediumButtonClass = `${buttonClass}__medium`;

  return (
    <button
      aria-label={buttonAriaLabel}
      className={`${textButtonClass} ${mediumButtonClass}`}
      onClick={() => toggleCreatureLock(id)}
      type="button"
      aria-pressed={ariaPressed}
    >
      <LockedIcon locked={locked} />
      {text}
    </button>
  );
}

export default CreatureLocker;
