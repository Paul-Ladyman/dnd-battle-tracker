import React, { useState } from 'react';
import OptionsMenuIcon from '../../icons/OptionsMenuIcon';
import KillStabalizeIcon from '../../icons/KillStabalizeIcon';
import InitiativeIcon from '../../icons/InitiativeIcon';
import TempHpIcon from '../../icons/TempHpIcon';
import AddHpIcon from '../../icons/AddHpIcon';
import AddNoteIcon from '../../icons/AddNoteIcon';
import MaxHpIcon from '../../icons/MaxHpIcon';
import ConditionsIcon from '../../icons/ConditionsIcon';

export default function NewCreatureToolbar({ creature }) {
  const [focused, setFocused] = useState(false);
  const {
    alive, name,
  } = creature;

  const toolbarClass = 'new-creature-toolbar';
  const toolbarClasses = focused ? `${toolbarClass} ${toolbarClass}__focused` : toolbarClass;
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;

  return (
    <div
      role="toolbar"
      aria-label={`${name} toolbar`}
      className={toolbarClasses}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
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
        <ConditionsIcon />
        Conditions
      </button>
      <button
        className={`${textButtonClass} ${buttonClass}__medium`}
        type="button"
      >
        <AddNoteIcon />
        Notes
      </button>
      <button
        className={`${textButtonClass} ${buttonClass}__small`}
        type="button"
      >
        <AddHpIcon />
        HP
      </button>
      <button
        className={`${textButtonClass} ${buttonClass}__medium`}
        type="button"
      >
        <MaxHpIcon />
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
