import React from 'react';
import Condition from './Condition';
import Note from './Note';

function CreatureNoteList({
  creatureId,
  label,
  noteList,
  round,
  secondsElapsed,
  isConditionList,
}) {
  if (noteList.length === 0) {
    return undefined;
  }

  const renderCondition = (condition) => (
    <Condition
      condition={condition}
      round={round}
      secondsElapsed={secondsElapsed}
      key={condition.id}
    />
  );

  const renderNote = (note, number) => (
    <Note
      note={note}
      number={number}
      round={round}
      secondsElapsed={secondsElapsed}
      key={`${note.id}-${creatureId}`}
    />
  );

  const firstNote = noteList[0];
  const otherNotes = noteList.slice(1);
  const labelKey = isConditionList ? `first-condition-${creatureId}` : `first-note-${creatureId}`;

  return (
    <>
      <div key={labelKey} className="avoid-break">
        <div className="creature-note-list--label">{label}</div>
        {isConditionList ? renderCondition(firstNote) : renderNote(firstNote, 1)}
      </div>
      {otherNotes.map((note, i) => (
        isConditionList ? renderCondition(note) : renderNote(note, i + 2)
      ))}
    </>
  );
}

export default CreatureNoteList;
