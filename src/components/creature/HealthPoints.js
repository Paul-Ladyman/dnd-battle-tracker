import React from 'react';
import { getDamageLevel } from '../../display/displayLogic';

function HealthPoints({
  short,
  hp,
  maxHp,
  tempHp,
  className,
  playerSession,
}) {
  const displayLong = !short && !playerSession;
  const displayTempHp = tempHp !== null && tempHp !== 0;
  const { level, display } = getDamageLevel(hp, maxHp);
  const classes = `health-points--${level} ${className}`;
  const hpLabel = playerSession ? 'Hit Points' : 'Current Hit Points';
  const shortTempHpDisplay = displayTempHp ? ` (+${tempHp})` : '';
  const shortHpDisplay = playerSession ? display : `${hp}${shortTempHpDisplay}`;
  const longHpDisplay = playerSession ? display : hp;

  return (
    <>
      {displayLong && (
        <div className={className}>
          <b>Max Hit Points</b>
          {' '}
          {maxHp}
        </div>
      )}
      {displayLong && displayTempHp && (
        <div className={className}>
          <b>Temporary Hit Points</b>
          {' '}
          {tempHp}
        </div>
      )}
      <div className={classes}>
        {short && `HP ${shortHpDisplay}`}
        {!short && (
          <>
            <b>{hpLabel}</b>
            {' '}
            {longHpDisplay}
          </>
        )}
      </div>
    </>
  );
}

HealthPoints.defaultProps = {
  short: false,
};

export default HealthPoints;
