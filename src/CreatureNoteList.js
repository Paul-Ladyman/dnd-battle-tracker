import React from 'react';
import Timer from './Timer';

function CreatureNoteList({
  creatureId,
  label,
  noteList,
  dismissHandler,
  round,
  secondsElapsed,
  className
}) {
  return (
    <div className={className}>
      <div><b>{label}:</b></div>
      <div className="creature-note-list">
        {noteList.map((note, i) => (
          <div key={i}>
            <div className="creature-note-list--title">
              <span className="creature-note-list--note"><em>{note.text}</em></span>
              <button className="creature-note-list--button" onClick={() => dismissHandler(creatureId, note)}>
                x
              </button>
            </div>
            <Timer
              startRound={note.appliedAtRound}
              endRound={round}
              startTime={note.appliedAtSeconds}
              endTime={secondsElapsed}
              className="creature-note-list--timer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreatureNoteList;