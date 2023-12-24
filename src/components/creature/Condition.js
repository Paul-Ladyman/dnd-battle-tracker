import React from 'react';
import Timer from '../page/Timer';
import ExternalLink from '../page/ExternalLink';

export default function Condition({
  condition,
  round,
  secondsElapsed,
}) {
  return (
    <div className="creature-note-list--item">
      <div className="creature-note-list--note">
        <b><ExternalLink url={condition.url}>{condition.text}</ExternalLink></b>
        .
        <Timer
          startRound={condition.appliedAtRound}
          endRound={round}
          startTime={condition.appliedAtSeconds}
          endTime={secondsElapsed}
          className="creature-note-list--timer"
        />
      </div>
    </div>
  );
}
