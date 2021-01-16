import React from 'react';
import getDamageLevel from '../display/displayLogic';

function HealthPoints({
  short,
  hp,
  maxHp,
  className,
  playerSession,
}) {
  const damageLevel = getDamageLevel(hp, maxHp);
  const classes = `health-points--${damageLevel.level} ${className}`;
  const hpLabel = playerSession ? 'Hit Points' : 'Current Hit Points';
  const hpDisplay = playerSession ? damageLevel.display : hp;

  return (
    <>
      {!short && !playerSession && (
      <div className={className}>
        <b>Max Hit Points</b>
        {' '}
        {maxHp}
      </div>
      )}
      <div className={classes}>
        {short && `HP ${hpDisplay}`}
        {!short && (
          <>
            <b>{hpLabel}</b>
            {' '}
            {hpDisplay}
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
