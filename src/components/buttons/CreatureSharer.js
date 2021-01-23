import React from 'react';
import ShareEnabledIcon from '../icons/ShareEnabledIcon';
import ShareDisabledIcon from '../icons/ShareDisabledIcon';

function CreatureSharer({ shared, name, shareHandler }) {
  const buttonTitle = shared ? 'Creature share enabled' : 'Creature share disabled';
  const buttonIcon = shared ? <ShareEnabledIcon /> : <ShareDisabledIcon />;
  const buttonAriaLabel = shared ? `${name} share enabled` : `${name} share disabled`;

  return (
    <button
      aria-label={buttonAriaLabel}
      className="creature-title-button"
      title={buttonTitle}
      onClick={shareHandler}
      type="button"
    >
      {buttonIcon}
    </button>
  );
}

export default CreatureSharer;
