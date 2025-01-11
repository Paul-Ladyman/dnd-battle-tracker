import React, { useState } from 'react';
import AddNoteIcon from '../../../icons/AddNoteIcon';
import CrossIcon from '../../../icons/CrossIcon';
import RemoveIcon from '../../../icons/RemoveIcon';
import ComboboxList from '../../../form/ComboboxList';

export default function NotesTool({
  name,
  id,
  addNoteToCreature,
  updateNoteForCreature,
  removeNoteFromCreature,
  notes: allNotes,
}) {
  const [value, setValue] = useState('');

  const notes = allNotes.filter((note) => note.text.toLowerCase().includes(value.toLowerCase()));

  const notesDropdownId = `notes-dropdown-${id}`;
  const notesAriaLabel = `${name} notes`;

  const handleNoteSubmit = (removeItem, selectedItem) => {
    if (removeItem) {
      removeNoteFromCreature(id, selectedItem, false);
    } else if (value) {
      if (selectedItem) {
        updateNoteForCreature(id, selectedItem.id, value);
      } else {
        addNoteToCreature(id, value, false);
      }
    }
  };

  const handleRemoveItem = (note) => {
    removeNoteFromCreature(id, note, false);
  };

  const inputAriaLabel = `add note for ${name}`;
  const inputAriaLabelItemSelected = `edit note for ${name}`;
  const rightControls = {
    rightTitle: 'Add Note',
    RightSubmitIcon: <CrossIcon />,
  };
  const rightControlsItemSelected = {
    rightTitle: 'Edit Note',
    RightSubmitIcon: <AddNoteIcon />,
  };
  const leftControls = {};
  const leftControlsItemSelected = {
    leftTitle: 'Remove note',
    LeftSubmitIcon: <RemoveIcon />,
  };

  return (
    <ComboboxList
      value={value}
      setValue={setValue}
      list={notes}
      id={`notes-wrapper-${id}`}
      dropdownId={notesDropdownId}
      dropdownLabel="Edit note"
      label="Notes"
      inputAriaLabel={inputAriaLabel}
      inputAriaLabelItemSelected={inputAriaLabelItemSelected}
      listAriaLabel={notesAriaLabel}
      rightControls={rightControls}
      rightControlsItemSelected={rightControlsItemSelected}
      leftControls={leftControls}
      leftControlsItemSelected={leftControlsItemSelected}
      handleSubmit={handleNoteSubmit}
      handleRemoveItem={handleRemoveItem}
    />
  );
}
