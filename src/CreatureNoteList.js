import React from 'react';
import Timer from './Timer';
import ExternalLink from './ExternalLink';

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
      <div className="creature-note-list--label">{label}</div>
      <div className="creature-note-list">
        {noteList.map((note, i) => {
          const noteText = note.url ?
            <ExternalLink className="creature-note-list--link" url={note.url} text={note.text} /> :
            note.text;

          return (
            <div key={i}>
              <div className="creature-note-list--title">
                <span className="creature-note-list--note"><em>{noteText}</em></span>
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
          )
        })}
      </div>
    </div>
  );
}

export default CreatureNoteList;