import React from 'react';
import NotesIcon from '../../../icons/AddNoteIcon';

export default function NotesButton({
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
      title="Notes"
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
