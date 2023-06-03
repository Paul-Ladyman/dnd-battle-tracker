import React from 'react';
import NotesIcon from '../../../icons/AddNoteIcon';
import NotesTool from '../../toolbar/NotesTool';

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
    <div className="new-creature-toolbar">
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
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
}) {
  const toolbarClass = 'new-creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const mediumButtonClass = `${buttonClass}__medium`;
  return (
    <button
      className={`${textButtonClass} ${mediumButtonClass}`}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      <NotesIcon />
      Notes
    </button>
  );
}
