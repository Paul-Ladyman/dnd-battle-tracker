import React, { useState, useRef, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import CreatureToolbarInput from './CreatureToolbarInput';
import AddNoteIcon from '../../icons/AddNoteIcon';
import CrossIcon from '../../icons/CrossIcon';
import { hotkeys } from '../../../hotkeys/hotkeys';

function NotesToolLabel(expanded) {
  const style = {
    transform: expanded ? 'rotate(180deg) translate(0, -3px)' : undefined,
    color: '#822000',
    forcedColorAdjust: 'auto',
    marginLeft: '5px',
  };

  return (
    <>
      Notes
      <svg width="18" height="16" aria-hidden="true" focusable="false" style={style}>
        <polygon className="arrow" strokeWidth="0" fillOpacity="0.75" fill="currentColor" points="3,6 15,6 9,14" />
      </svg>
    </>
  );
}

export default function NotesTool({
  name,
  id,
  addNoteToCreature,
  removeNoteFromCreature,
  notes,
}) {
  const [expanded, setExpanded] = useState(false);
  const [focusedItem, setFocusedItem] = useState(null);
  const inputRef = useRef();

  const hasNotes = notes.length > 0;
  const showNotes = hasNotes && expanded;
  const className = 'creature-toolbar--notes';
  const classModifier = 'creature-toolbar--notes__open';
  const customClasses = showNotes ? `${className} ${classModifier}` : className;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const moveFocus = (down = true) => {
    const noItemFocused = focusedItem === null;
    const start = 0;
    const end = notes.length - 1;
    const endBound = down ? end : start;
    const startBound = down ? start : end;
    const endItemFocused = focusedItem === endBound;

    if (!expanded) {
      setExpanded(true);
    }

    if (noItemFocused || endItemFocused) {
      return setFocusedItem(startBound);
    }

    const focusIncrement = down ? 1 : -1;
    return setFocusedItem((currentlyFocusedItem) => currentlyFocusedItem + focusIncrement);
  };

  const hotKeyHandler = (e) => {
    if (notes.length === 0) return null;

    if (isHotkey(hotkeys.dropdownNavDown, e)) {
      return moveFocus();
    }

    if (isHotkey(hotkeys.dropdownNavUp, e)) {
      return moveFocus(false);
    }

    if (isHotkey(hotkeys.dropdownNavOpen, e)) {
      setExpanded(true);
    }

    return null;
  };

  useEffect(() => {
    inputRef.current.addEventListener('keydown', hotKeyHandler);

    return () => inputRef.current.removeEventListener('keydown', hotKeyHandler);
  }, [focusedItem, notes, expanded]);

  return (
    <div className="input--form creature-toolbar--notes-wrapper">
      <CreatureToolbarInput
        ariaLabel={`add or edit note for ${name}`}
        label={NotesToolLabel(showNotes)}
        rightSubmit={(note) => addNoteToCreature(id, note, false)}
        rightControls={{
          rightTitle: 'Add/Edit Note',
          RightSubmitIcon: <AddNoteIcon />,
        }}
        inputId={`notes-${id}`}
        customClasses={customClasses}
        onClick={toggleExpanded}
        inputRef={inputRef}
      />
      {showNotes && (
        <ul className="creature-toolbar--notes-dropdown">
          {
            notes.map((note, i) => {
              const itemClass = 'creature-toolbar--notes-dropdown-item';
              const itemModifier = focusedItem === i ? ` ${itemClass}__focused` : '';
              const itemClassName = `${itemClass}${itemModifier}`;
              return (
                <div className="creature-toolbar--notes-dropdown-group">
                  <li className={itemClassName}>{note.text}</li>
                  <button
                    type="button"
                    title="Remove note"
                    className="input--submit creature-toolbar--notes-dropdown-button"
                    onClick={() => removeNoteFromCreature(id, note, false)}
                  >
                    <CrossIcon rotate />
                  </button>
                </div>
              );
            })
          }
        </ul>
      )}
    </div>
  );
}
