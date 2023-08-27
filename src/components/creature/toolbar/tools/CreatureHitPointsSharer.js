import React from 'react';
import ShareHitPointsIcon from '../../../icons/ShareHitPointsIcon';

function CreatureHitPointsSharer({
  creature,
  toggleCreatureHitPointsShare,
}) {
  const { hitPointsShared, name, id } = creature;
  const text = hitPointsShared ? 'Unshare HP' : 'Share HP';
  const buttonAriaLabel = hitPointsShared ? `Unshare ${name} HP` : `Share ${name} HP`;
  const ariaPressed = hitPointsShared ? 'true' : 'false';
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;

  return (
    <button
      aria-label={buttonAriaLabel}
      aria-pressed={ariaPressed}
      className={textButtonClass}
      onClick={() => toggleCreatureHitPointsShare(id)}
      type="button"
    >
      <ShareHitPointsIcon enabled={hitPointsShared} />
      {text}
    </button>
  );
}

export default CreatureHitPointsSharer;
