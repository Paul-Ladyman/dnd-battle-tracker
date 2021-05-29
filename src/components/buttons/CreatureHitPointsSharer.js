import React from 'react';
import ShareHitPointsIcon from '../icons/ShareHitPointsIcon';

function CreatureHitPointsSharer({
  shared,
  name,
  shareHandler,
  disabled,
}) {
  const buttonTitle = shared ? 'Creature hit points share enabled' : 'Creature hit points share disabled';
  const buttonAriaLabel = shared ? `${name} hit points share enabled` : `${name} hit points share disabled`;
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
      <ShareHitPointsIcon enabled={shared} />
    </button>
  );
}

export default CreatureHitPointsSharer;
