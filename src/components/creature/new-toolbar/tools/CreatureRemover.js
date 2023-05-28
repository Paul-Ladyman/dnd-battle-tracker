import React, { useState } from 'react';
import RemoveCreatureIcon from '../../../icons/RemoveCreatureIcon';

export default function CreatureRemover({
  creature,
  removeCreature,
  disabled,
}) {
  const [removing, setRemoving] = useState(false);
  const { name, id } = creature;
  const ariaDisabled = disabled ? 'true' : 'false';
  const onClick = () => {
    if (!disabled) setRemoving(true);
  };
  const onClickConfim = () => {
    if (!disabled) removeCreature(id);
  };
  const toolbarClass = 'new-creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;

  return (
    <>
      {!removing
      && (
      <button
        aria-label={`remove ${name}`}
        aria-disabled={ariaDisabled}
        className={textButtonClass}
        onClick={onClick}
        type="button"
      >
        <RemoveCreatureIcon />
        Remove
      </button>
      )}
      {removing
      && (
      <button
        aria-label={`confirm remove ${creature.name}`}
        aria-disabled={ariaDisabled}
        title="Confirm remove creature"
        className={textButtonClass}
        onClick={onClickConfim}
        type="button"
      >
        <RemoveCreatureIcon />
        <div>Confirm...</div>
      </button>
      )}
    </>
  );
}
