import React from 'react';

function getTime(startTime, endTime) {
  if (endTime) {
    return endTime - startTime;
  }
  return startTime;
}

function getRound(startRound, endRound) {
  if (startRound !== undefined && endRound !== undefined) {
    if (endRound === 0) {
      return endRound;
    }

    if (startRound === 0) {
      return endRound - startRound -1;
    }

    return endRound - startRound;
  }
  return startRound;
}

function Timer ({
  startRound,
  endRound,
  startTime,
  endTime,
  className
}) {
  const time = getTime(startTime, endTime);
  const round = getRound(startRound, endRound);
  const showRound = round !== undefined;
  const minutes = Math.floor(parseFloat(time) / 60.0);
  const remainingSeconds = time % 60;

  const roundAriaLabel = showRound ? `${round} rounds ` : '';
  const timeAriaLabel = `${minutes} minutes ${remainingSeconds} seconds`;

  return (
    <span className={className} aria-label={roundAriaLabel + timeAriaLabel}>
      {showRound && `${round}r `}
      {`${minutes}m `}
      {`${remainingSeconds}s`}
    </span>
  );
}

Timer.defaultProps = {
  startRound: undefined,
  endRound: undefined,
  endTime: undefined
};

export default Timer;