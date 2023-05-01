import React from 'react';
import KillStabalizeIcon from '../../../icons/KillStabalizeIcon';

export default function StatusButton({
  creature,
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
}) {
  const { alive } = creature;
  const toolbarClass = 'new-creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  return (
    <button
      title="Kill/Make unconscious"
      className={buttonClass}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      <KillStabalizeIcon alive={alive} />
    </button>
  );
}
