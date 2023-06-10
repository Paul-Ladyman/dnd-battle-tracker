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
  const ariaLabel = removing ? `confirm remove ${creature.name}` : `remove ${name}`;
  const title = removing ? 'Confirm remove creature' : '';
  const buttonOnClick = removing ? onClickConfim : onClick;
  const text = removing ? 'Confim...' : 'Remove';

  return (
    <button
      aria-label={ariaLabel}
      aria-disabled={ariaDisabled}
      title={title}
      className={textButtonClass}
      onClick={buttonOnClick}
      type="button"
    >
      <RemoveCreatureIcon />
      {text}
    </button>
  );
}
