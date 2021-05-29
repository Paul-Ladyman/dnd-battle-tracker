import React from 'react';
import ShareHealthIcon from '../icons/ShareHealthIcon';

function CreatureHitPointSharer({
  shared,
  name,
  shareHandler,
  disabled,
}) {
  const buttonTitle = shared ? 'Creature health share enabled' : 'Creature health share disabled';
  const buttonAriaLabel = shared ? `${name} health share enabled` : `${name} health share disabled`;
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
      <ShareHealthIcon enabled={shared} />
    </button>
  );
}

export default CreatureHitPointSharer;
