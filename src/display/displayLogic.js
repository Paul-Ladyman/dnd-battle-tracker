export default function getDamageLevel(hp, maxHp) {
  const criticalLevel = maxHp / 2;

  if (hp === 0) {
    return { level: 'injured', display: '0' };
  }

  if (hp < criticalLevel) {
    return { level: 'injured', display: 'Injured' };
  }

  if (hp < maxHp) {
    return { level: 'damaged', display: 'Damaged' };
  }

  return { level: 'fine', display: 'Fine' };
}
