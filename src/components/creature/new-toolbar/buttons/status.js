import React from 'react';
import KillStabalizeIcon from '../../../icons/KillStabalizeIcon';

export default function StatusButton({
  creature,
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
  creatureManagement,
}) {
  const { alive, id } = creature;
  const { killCreature, stabalizeCreature } = creatureManagement;
  const toolbarClass = 'new-creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const mediumButtonClass = `${buttonClass}__medium`;
  const statusToolTitle = alive ? 'Kill' : 'Stabalize';
  const onClickStatus = () => {
    if (alive) {
      killCreature(id);
    } else {
      stabalizeCreature(id);
    }
    onClick();
  };

  return (
    <button
      className={`${textButtonClass} ${mediumButtonClass}`}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={onClickStatus}
      tabIndex={tabIndex}
      aria-pressed={!alive}
    >
      <KillStabalizeIcon alive={alive} />
      {statusToolTitle}
    </button>
  );
}
