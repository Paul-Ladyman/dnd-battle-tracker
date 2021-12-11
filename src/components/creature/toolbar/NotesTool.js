import React, { useState } from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import AddNoteIcon from '../../icons/AddNoteIcon';
import CrossIcon from '../../icons/CrossIcon';

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
        label={NotesToolLabel(showNotes)}
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
