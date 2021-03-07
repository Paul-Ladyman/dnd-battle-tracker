import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import AddNoteIcon from '../../icons/AddNoteIcon';

export default function NotesTool({
  name,
  id,
  addNoteToCreature,
}) {
  return (
    <CreatureToolbarInput
      ariaLabel={`add note to ${name}`}
      label="Add Note"
      rightSubmit={(note) => addNoteToCreature(id, note, false)}
      rightControls={{
        rightTitle: 'Add Note',
        RightSubmitIcon: <AddNoteIcon />,
      }}
      inputId={`notes-${id}`}
    />
  );
}
