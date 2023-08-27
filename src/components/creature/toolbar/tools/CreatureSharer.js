import React from 'react';
import ShareIcon from '../../../icons/ShareIcon';

function CreatureSharer({
  creature,
  toggleCreatureShare,
  active,
}) {
  const { shared, name, id } = creature;
  const disabled = active && shared;

  const text = shared ? 'Unshare' : 'Share';
  const buttonAriaLabel = shared ? `Unshare ${name}` : `Share ${name}`;
  const ariaPressed = shared ? 'true' : 'false';
  const ariaDisabled = disabled ? 'true' : 'false';
  const onClick = () => {
    if (!disabled) toggleCreatureShare(id);
  };
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const mediumButtonClass = `${buttonClass}__medium`;

  return (
    <button
      aria-label={buttonAriaLabel}
      aria-pressed={ariaPressed}
      aria-disabled={ariaDisabled}
      className={`${textButtonClass} ${mediumButtonClass}`}
      onClick={onClick}
      type="button"
    >
      <ShareIcon enabled={shared} />
      {text}
    </button>
  );
}

export default CreatureSharer;
