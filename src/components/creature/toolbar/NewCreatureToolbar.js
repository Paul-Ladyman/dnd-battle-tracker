import React from 'react';
import OptionsMenuIcon from '../../icons/OptionsMenuIcon';
import KillStabalizeIcon from '../../icons/KillStabalizeIcon';
import InitiativeIcon from '../../icons/InitiativeIcon';
import TempHpIcon from '../../icons/TempHpIcon';
import AddHpIcon from '../../icons/AddHpIcon';
import AddNoteIcon from '../../icons/AddNoteIcon';

export default function NewCreatureToolbar({ creature }) {
  const {
    alive, name,
  } = creature;

  const buttonClass = 'new-creature-toolbar-button';
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;

  return (
    <div role="toolbar" aria-label={`${name} toolbar`} className="new-creature-toolbar">
      <button
        title="Creature Menu"
        type="button"
        className={buttonClass}
      >
        <OptionsMenuIcon />
      </button>
      <button
        className={buttonClass}
        title="Kill/Make unconscious"
        type="button"
      >
        <KillStabalizeIcon alive={alive} />
      </button>
      <button
        className={textButtonClass}
        type="button"
      >
        <InitiativeIcon />
        Initiative
      </button>
      <button
        className={textButtonClass}
        type="button"
      >
        <InitiativeIcon />
        Conditions
      </button>
      <button
        className={textButtonClass}
        type="button"
      >
        <AddNoteIcon />
        Notes
      </button>
      <button
        className={textButtonClass}
        type="button"
      >
        <AddHpIcon />
        Damage/Heal
      </button>
      <button
        className={textButtonClass}
        type="button"
      >
        <AddHpIcon />
        Max HP
      </button>
      <button
        className={textButtonClass}
        type="button"
      >
        <TempHpIcon />
        Temp HP
      </button>
    </div>
  );
}
