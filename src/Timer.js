import React from 'react';

function getTime(startTime, endTime) {
  if (endTime) {
    return endTime - startTime;
  }
  return startTime;
}

function getRound(startRound, endRound) {
  if (startRound && endRound) {
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
  return (
    <div className={className}>
      {showRound && `${round}r `}
      {`${minutes}m `}
      {`${remainingSeconds}s`}
    </div>
  );
}

Timer.defaultProps = {
  startRound: undefined,
  endRound: undefined,
  endTime: undefined
};

export default Timer;