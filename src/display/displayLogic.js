export default function getDamageLevel(hp, maxHp) {
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
