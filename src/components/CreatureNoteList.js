import React from 'react';
import Timer from './Timer';
import ExternalLink from './ExternalLink';
import RemoveIcon from './icons/RemoveIcon';

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
            <ExternalLink url={note.url} text={note.text} /> :
            note.text;

          return (
            <div className="creature-note-list--item" key={i}>
              <div>
                  <div className="creature-note-list--note">
                    <em>{noteText}</em>
                  </div>
                <Timer
                  startRound={note.appliedAtRound}
                  endRound={round}
                  startTime={note.appliedAtSeconds}
                  endTime={secondsElapsed}
                  className="creature-note-list--timer"
                />
              </div>
              <button className="creature-note-list--button" title="Remove note" onClick={() => dismissHandler(creatureId, note)}>
                <RemoveIcon />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CreatureNoteList;