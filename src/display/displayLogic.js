export function getDamageLevel(hp, maxHp) {
  const injuredLevel = maxHp / 2;
  const badlyInjuredLevel = maxHp / 4;

  if (hp === 0) {
    return { level: 'injured', display: '0' };
  }

  if (hp < badlyInjuredLevel) {
    return { level: 'injured', display: 'Badly injured' };
  }

  if (hp < injuredLevel) {
    return { level: 'injured', display: 'Injured' };
  }

  if (hp < maxHp) {
    return { level: 'damaged', display: 'Damaged' };
  }

  return { level: 'fine', display: 'Fine' };
}

export function getHealthBar(hp, maxHp, alive, showHitPoints) {
  if (!alive) {
    return [0, 0];
  }

  if (hp === undefined || hp === null) {
    return [100, 100];
  }

  if (hp <= 0 || maxHp <= 0) {
    return [0, 0];
  }

  if (!showHitPoints || hp >= maxHp) {
    return [100, 100];
  }

  const healthPercentage = Math.ceil((hp / maxHp) * 100);
  const rightPercentage = healthPercentage < 85 ? healthPercentage + 15 : 100;
  return [healthPercentage, rightPercentage];
}

export function shouldShowHitPoints(hitPoints, hitPointsShared, playerSession) {
  if (hitPoints === undefined || hitPoints === null) return false;
  if (!playerSession) return true;
  return hitPointsShared;
}
