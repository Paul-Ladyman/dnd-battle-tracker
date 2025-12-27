import React from 'react';
import NotesIcon from '../../../icons/AddNoteIcon';
import NotesTool from '../tools/NotesTool';

export function NotesToolMenu({
  creature,
  creatureManagement,
}) {
  const {
    notes,
    id,
    name,
  } = creature;
  const {
    addNoteToCreature,
    updateNoteForCreature,
    removeNoteFromCreature,
  } = creatureManagement;
  return (
    <div className="creature-toolbar--grid creature-toolbar--entrance">
      <NotesTool
        name={name}
        id={id}
        addNoteToCreature={addNoteToCreature}
        updateNoteForCreature={updateNoteForCreature}
        removeNoteFromCreature={removeNoteFromCreature}
        notes={notes}
      />
    </div>
  );
}

export function NotesButton({
  creature,
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
  focused,
  toolMenuExpanded,
  toolMenuId,
}) {
  const { selected } = creature;
  const ariaDisabled = selected ? 'true' : 'false';
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const mediumButtonClass = `${buttonClass}__medium`;
  const focusedButtonClass = focused ? `${buttonClass}__focused` : '';
  return (
    <button
      className={`${textButtonClass} ${mediumButtonClass} ${focusedButtonClass}`}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={() => !selected && onClick()}
      tabIndex={tabIndex}
      aria-haspopup="true"
      aria-controls={toolMenuId}
      aria-expanded={toolMenuExpanded}
      aria-disabled={ariaDisabled}
    >
      <NotesIcon />
      Notes
    </button>
  );
}
