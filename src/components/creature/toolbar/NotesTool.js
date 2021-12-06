import React, { useState } from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import AddNoteIcon from '../../icons/AddNoteIcon';
import CrossIcon from '../../icons/CrossIcon';

export default function NotesTool({
  name,
  id,
  addNoteToCreature,
  notes,
}) {
  const [expanded, setExpanded] = useState(false);
  const hasNotes = notes.length > 0;
  const showNotes = hasNotes && expanded;
  const className = 'creature-toolbar--notes';
  const classModifier = 'creature-toolbar--notes__open';
  const customClasses = showNotes ? `${className} ${classModifier}` : className;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="input--form creature-toolbar--notes-wrapper">
      <CreatureToolbarInput
        ariaLabel={`add or edit note for ${name}`}
        label="Notes"
        rightSubmit={(note) => addNoteToCreature(id, note, false)}
        rightControls={{
          rightTitle: 'Add/Edit Note',
          RightSubmitIcon: <AddNoteIcon />,
        }}
        inputId={`notes-${id}`}
        customClasses={customClasses}
        onClick={toggleExpanded}
        onBlur={() => setExpanded(false)}
      />
      {showNotes && (
        <ul className="creature-toolbar--notes-dropdown">
          {
            notes.map(({ text }) => (
              <div className="creature-toolbar--notes-dropdown-group">
                <li className="creature-toolbar--notes-dropdown-item">{text}</li>
                <button type="button" title="Remove note" className="input--submit creature-toolbar--notes-dropdown-button">
                  <CrossIcon rotate />
                </button>
              </div>
            ))
          }
        </ul>
      )}
    </div>
  );
}
