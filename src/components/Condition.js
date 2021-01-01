import React from 'react';
import Timer from './Timer';
import ExternalLink from './ExternalLink';
import RemoveIcon from './icons/RemoveIcon';

export default function Condition({
  condition,
  round,
  secondsElapsed,
  playerSession,
  dismissHandler,
  creatureId,
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
      {!playerSession && (
      <button
        className="creature-note-list--button"
        title="Remove note"
        onClick={() => dismissHandler(creatureId, condition)}
        type="button"
      >
        <RemoveIcon />
      </button>
      )}
    </div>
  );
}
