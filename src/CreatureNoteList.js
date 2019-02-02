import React from 'react';
import Timer from './Timer';

function CreatureNoteList({
  creatureId,
  label,
  noteList,
  dismissHandler,
  round,
  secondsElapsed
}) {
  return (
    <React.Fragment>
      <div>{label}:</div>
      {noteList.map((note, i) => (
        <div key={i}>
          {note.text}
          <button onClick={() => dismissHandler(creatureId, note.text)}>
            x
          </button>
          <Timer
            startRound={note.appliedAtRound}
            endRound={round}
            startTime={note.appliedAtSeconds}
            endTime={secondsElapsed}
          />
        </div>
      ))}
    </React.Fragment>
  );
}

export default CreatureNoteList;