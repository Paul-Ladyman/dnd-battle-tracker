import React from 'react';

function getDamageClass(hp, maxHp) {
  const maxHpFloat = parseFloat(maxHp);
  const damagedLevel = maxHpFloat / 2.0;
  const criticalLevel = maxHpFloat / 4.0;

  if (hp <= damagedLevel && hp > criticalLevel) {
    return 'health-points--damaged';
  }

  if (hp <= criticalLevel) {
    return 'health-points--critical';
  }

  return 'health-points--fine';
}

function HealthPoints({
  short,
  hp,
  maxHp,
  className
}) {
  const classes = `${getDamageClass(hp, maxHp)} ${className}`;
  const text = short ? `${hp}HP` : `Current Health: ${hp}`;
  return (
    <React.Fragment>
      {!short && <div className={className}>Max Health: {maxHp}</div>}
      <div className={classes}>{text}</div>
    </React.Fragment>
  )
}

HealthPoints.defaultProps = {
  short: false
}

export default HealthPoints;