import React, { useState, useRef } from 'react';
import isHotkey from 'is-hotkey';
import AddNoteIcon from '../../icons/AddNoteIcon';
import CrossIcon from '../../icons/CrossIcon';
import { hotkeys } from '../../../hotkeys/hotkeys';
import Input from '../../page/Input';

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
  const [selectedItem, setSelectedItem] = useState(null);
  const [value, setValue] = useState('');
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

  const handleItemSubmit = (item) => {
    setSelectedItem(item);
    setFocusedItem(null);
    setExpanded(false);
    setValue(item.text);
    inputRef.current.focus();
  };

  const resetDropdown = () => {
    setExpanded(false);
    setFocusedItem(null);
    setSelectedItem(null);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const resetForm = () => {
    setValue('');
    resetDropdown();
  };

  const submitHandler = () => {
    if (value) {
      resetForm();
      if (selectedItem) {
        console.log('>>> UPDATING NOTE', selectedItem);
      } else {
        addNoteToCreature(id, value, false);
      }
    }
  };

  const formHandler = (e) => {
    if (notes.length > 0) {
      if (isHotkey(hotkeys.dropdownNavDown, e)) moveFocus();
      if (isHotkey(hotkeys.dropdownNavUp, e)) moveFocus(false);
      if (isHotkey(hotkeys.dropdownNavOpen, e)) setExpanded(true);
      if (isHotkey(hotkeys.dropdownEscape, e)) resetDropdown();
    }

    if (isHotkey('enter', e)) {
      e.preventDefault();

      if (focusedItem !== null) {
        handleItemSubmit(notes[focusedItem]);
      } else {
        submitHandler(false);
      }
    }
  };

  return (
    <div className="input--form creature-toolbar--notes-wrapper">
      <Input
        ariaLabel={`add or edit note for ${name}`}
        label={NotesToolLabel(showNotes)}
        rightControls={{
          rightTitle: 'Add/Edit Note',
          RightSubmitIcon: <AddNoteIcon />,
        }}
        inputId={`notes-${id}`}
        customClasses={customClasses}
        onClick={toggleExpanded}
        inputRef={inputRef}
        value={value}
        handleChange={handleChange}
        submitHandler={submitHandler}
        formHandler={formHandler}
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
                  {/* eslint-disable jsx-a11y/click-events-have-key-events */}
                  <li
                    className={itemClassName}
                    role="option"
                    onClick={() => handleItemSubmit(note)}
                  >
                    {note.text}
                  </li>
                  {/* eslint-enable jsx-a11y/click-events-have-key-events */}
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
