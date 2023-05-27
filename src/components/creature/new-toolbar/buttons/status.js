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
  const statusToolTitle = alive ? 'Kill/Make unconscious' : 'Stabalize';
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
      title={statusToolTitle}
      className={buttonClass}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={onClickStatus}
      tabIndex={tabIndex}
      aria-pressed={!alive}
    >
      <KillStabalizeIcon alive={alive} />
    </button>
  );
}
