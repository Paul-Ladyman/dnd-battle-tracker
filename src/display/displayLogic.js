export default function getDamageLevel(hp, maxHp) {
  const criticalLevel = maxHp / 4;

  if (hp === 0) {
    return { level: 'critical', display: '0' };
  }

  if (hp <= criticalLevel) {
    return { level: 'critical', display: 'Critical' };
  }

  if (hp < maxHp) {
    return { level: 'damaged', display: 'Damaged' };
  }

  return { level: 'fine', display: 'Fine' };
}
