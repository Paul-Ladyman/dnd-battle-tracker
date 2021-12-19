import React, { useState, useRef } from 'react';
import isHotkey from 'is-hotkey';
import AddNoteIcon from '../../icons/AddNoteIcon';
import CrossIcon from '../../icons/CrossIcon';
import { hotkeys } from '../../../hotkeys/hotkeys';
import Input from '../../page/Input';

function NotesToolLabel(expanded, label, dropdownId, onClick) {
  const style = {
    transform: expanded ? 'rotate(180deg) translate(0, -3px)' : undefined,
    color: '#822000',
    forcedColorAdjust: 'auto',
    marginLeft: '5px',
  };

  return (
    <>
      Notes
      <button
        className="creature-toolbar--notes-dropdown-expander"
        type="button"
        tabIndex="-1"
        aria-label={label}
        aria-expanded={expanded}
        aria-controls={dropdownId}
        onClick={onClick}
      >
        <svg width="18" height="16" aria-hidden="true" focusable="false" style={style}>
          <polygon className="arrow" strokeWidth="0" fillOpacity="0.75" fill="currentColor" points="3,6 15,6 9,14" />
        </svg>
      </button>
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
  const notesDropdownId = `notes-dropdown-${id}`;
  const notesAriaLabel = 'notes';
  const dropdownClassName = 'creature-toolbar--notes-dropdown';
  const dropdownClassModifier = `${dropdownClassName}__open`;
  const dropdownClasses = showNotes ? `${dropdownClassName} ${dropdownClassModifier}` : dropdownClassName;
  const activeNoteId = focusedItem !== null ? `notes-dropdown-${id}-${focusedItem}` : '';

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const moveFocus = (e, down = true) => {
    if (value !== '' && !expanded) return null;

    e.preventDefault();

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

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const resetForm = () => {
    setValue('');
    setExpanded(false);
    setFocusedItem(null);
    setSelectedItem(null);
  };

  const handleItemSubmit = (item) => {
    setSelectedItem(item);
    setFocusedItem(null);
    setExpanded(false);
    setValue(item.text);
    inputRef.current.focus();
  };

  const handleNoteSubmit = () => {
    if (value) {
      resetForm();
      if (selectedItem) {
        console.log('>>> UPDATING NOTE', selectedItem);
      } else {
        addNoteToCreature(id, value, false);
      }
    }
  };

  const handleSubmit = () => {
    if (focusedItem !== null) {
      handleItemSubmit(notes[focusedItem]);
    } else {
      handleNoteSubmit();
    }
  };

  const handleEscape = () => {
    if (expanded) {
      setExpanded(false);
    } else {
      resetForm();
    }
  };

  const formHandler = (e) => {
    if (notes.length > 0) {
      if (isHotkey(hotkeys.dropdownNavDown, e)) moveFocus(e);
      if (isHotkey(hotkeys.dropdownNavUp, e)) moveFocus(e, false);
      if (isHotkey(hotkeys.dropdownNavOpen, e)) setExpanded(true);
      if (isHotkey(hotkeys.dropdownEscape, e)) handleEscape();
    }

    if (isHotkey('enter', e)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="input--form creature-toolbar--notes-wrapper">
      <Input
        ariaLabel={`add or edit note for ${name}`}
        ariaAutoComplete="none"
        ariaExpanded={expanded}
        ariaControls={notesDropdownId}
        ariaActiveDescendant={activeNoteId}
        role="combobox"
        label={NotesToolLabel(showNotes, notesAriaLabel, notesDropdownId, toggleExpanded)}
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
        submitHandler={handleNoteSubmit}
        formHandler={formHandler}
      />
      <ul className={dropdownClasses} id={notesDropdownId} role="listbox" aria-label={notesAriaLabel}>
        {
          notes.map((note, i) => {
            const selected = focusedItem === i;
            const itemClass = 'creature-toolbar--notes-dropdown-item';
            const itemModifier = selected ? ` ${itemClass}__focused` : '';
            const itemClassName = `${itemClass}${itemModifier}`;
            return (
              <div className="creature-toolbar--notes-dropdown-group">
                {/* eslint-disable jsx-a11y/click-events-have-key-events */}
                <li
                  className={itemClassName}
                  role="option"
                  onClick={() => handleItemSubmit(note)}
                  aria-selected={selected}
                  id={`notes-dropdown-${id}-${i}`}
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
    </div>
  );
}
