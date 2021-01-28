import React from 'react';
import ShareEnabledIcon from '../icons/ShareEnabledIcon';
import ShareDisabledIcon from '../icons/ShareDisabledIcon';

function CreatureSharer({
  shared,
  name,
  shareHandler,
  disabled,
}) {
  const buttonTitle = shared ? 'Creature share enabled' : 'Creature share disabled';
  const buttonIcon = shared ? <ShareEnabledIcon /> : <ShareDisabledIcon />;
  const buttonAriaLabel = shared ? `${name} share enabled` : `${name} share disabled`;
  const buttonClass = 'creature-title-button';
  const buttonClasses = disabled ? `${buttonClass} button__disabled` : buttonClass;

  return (
    <button
      aria-label={buttonAriaLabel}
      className={buttonClasses}
      title={buttonTitle}
      onClick={shareHandler}
      type="button"
      disabled={disabled}
    >
      {buttonIcon}
    </button>
  );
}

export default CreatureSharer;
