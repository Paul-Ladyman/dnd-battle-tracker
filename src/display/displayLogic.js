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

export function getHitPointsBar(hitPoints, maxHitPoints, alive, showHitPoints) {
  if (!alive) {
    return [0, 0];
  }

  if (hitPoints === undefined || hitPoints === null) {
    return [100, 100];
  }

  if (hitPoints <= 0 || maxHitPoints <= 0) {
    return [0, 0];
  }

  if (!showHitPoints || hitPoints >= maxHitPoints) {
    return [100, 100];
  }

  const hitPointsPercentage = Math.ceil((hitPoints / maxHitPoints) * 100);
  const rightPercentage = hitPointsPercentage < 85 ? hitPointsPercentage + 15 : 100;
  return [hitPointsPercentage, rightPercentage];
}

export function shouldShowHitPoints(hitPoints, hitPointsShared, playerSession) {
  if (hitPoints === undefined || hitPoints === null) return false;
  if (!playerSession) return true;
  return hitPointsShared;
}
