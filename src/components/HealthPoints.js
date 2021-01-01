import React from 'react';

function getDamageLevel(hp, maxHp) {
  const maxHpFloat = parseFloat(maxHp);
  const criticalLevel = Math.ceil(maxHpFloat / 4.0);

  if (hp === 0) {
    return { level: 'critical', display: '0' };
  }

  if (hp < maxHp && hp > criticalLevel) {
    return { level: 'damaged', display: 'Damaged' };
  }

  if (hp <= criticalLevel) {
    return { level: 'critical', display: 'Critical' };
  }

  return { level: 'fine', display: 'Fine' };
}

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
