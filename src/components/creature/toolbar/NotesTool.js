import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import AddNoteIcon from '../../icons/AddNoteIcon';
import CrossIcon from '../../icons/CrossIcon';

export default function NotesTool({
  name,
  id,
  addNoteToCreature,
  notes,
}) {
  console.log('>>> NOTES', notes);
  const hasNotes = notes.length > 0;
  const customClasses = hasNotes ? 'creature-toolbar--notes' : '';
  return (
    <div className="input--form">
      <CreatureToolbarInput
        ariaLabel={`add note to ${name}`}
        label="Add Note"
        rightSubmit={(note) => addNoteToCreature(id, note, false)}
        rightControls={{
          rightTitle: 'Add Note',
          RightSubmitIcon: <AddNoteIcon />,
        }}
        inputId={`notes-${id}`}
        customClasses={customClasses}
      />
      {hasNotes && (
        <ul className="creature-toolbar--notes-dropdown">
          {
            notes.map(({ text }) => (
              <>
                <li className="creature-toolbar--notes-dropdown-item">{text}</li>
                <button type="button" title="Remove note"><CrossIcon /></button>
              </>
            ))
          }
        </ul>
      )}
    </div>
  );
}
