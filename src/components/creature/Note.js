import React from 'react';
import Timer from '../page/Timer';
import CrossIcon from '../icons/CrossIcon';

export default function Note({
  note,
  number,
  round,
  secondsElapsed,
  playerSession,
  dismissHandler,
  creatureId,
}) {
  return (
    <div className="creature-note-list--item">
      <div className="creature-note-list--note">
        <span>
          <b>
            {number}
            .
          </b>
          {' '}
          {`${note.text[0].toUpperCase()}${note.text.substring(1)}`}
        </span>
        .
        <Timer
          startRound={note.appliedAtRound}
          endRound={round}
          startTime={note.appliedAtSeconds}
          endTime={secondsElapsed}
          className="creature-note-list--timer"
        />
      </div>
      {!playerSession && (
      <button
        className="creature-note-list--button"
        title="Remove note"
        onClick={() => dismissHandler(creatureId, note)}
        type="button"
      >
        <CrossIcon rotate />
      </button>
      )}
    </div>
  );
}
