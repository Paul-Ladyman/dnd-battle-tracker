import React from 'react';
import Timer from '../page/Timer';

export default function Note({
  note,
  number,
  round,
  secondsElapsed,
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
    </div>
  );
}
