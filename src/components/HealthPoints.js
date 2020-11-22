import React from 'react';

function getDamageLevel(hp, maxHp) {
  const maxHpFloat = parseFloat(maxHp);
  const damagedLevel = maxHpFloat / 2.0;
  const criticalLevel = maxHpFloat / 4.0;

  if (hp === 0) {
    return { level: 'critical', display: 'Unconscious' };
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
  playerSession
}) {
  const damageLevel = getDamageLevel(hp, maxHp);
  const classes = `health-points--${damageLevel.level} ${className}`;
  const numericHp = short ? `${hp}HP` : hp;

  return (<React.Fragment>
    {!short && !playerSession && <div className={className}><b>Max Hit Points</b> {maxHp}</div>}
    <div className={classes}>
      {!short && !playerSession && <b>Current Hit Points </b>}
      {playerSession ? `HP ${damageLevel.display}` : numericHp}
    </div>
  </React.Fragment>);
}

HealthPoints.defaultProps = {
  short: false
}

export default HealthPoints;