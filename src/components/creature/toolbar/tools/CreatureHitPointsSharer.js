import React from 'react';
import ShareHitPointsIcon from '../../../icons/ShareHitPointsIcon';

function CreatureHitPointsSharer({
  creature,
  shareCreatureHitPoints,
  unshareCreatureHitPoints,
}) {
  const {
    hitPointsShared,
    name,
    id,
  } = creature;
  const text = hitPointsShared ? 'Unshare HP' : 'Share HP';
  const buttonAriaLabel = hitPointsShared ? `Unshare ${name} HP` : `Share ${name} HP`;
  const ariaPressed = hitPointsShared ? 'true' : 'false';
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const onClick = () => {
    if (hitPointsShared) unshareCreatureHitPoints(id);
    else shareCreatureHitPoints(id);
  };

  return (
    <button
      aria-label={buttonAriaLabel}
      aria-pressed={ariaPressed}
      className={textButtonClass}
      onClick={onClick}
      type="button"
    >
      <ShareHitPointsIcon enabled={hitPointsShared} />
      {text}
    </button>
  );
}

export default CreatureHitPointsSharer;
