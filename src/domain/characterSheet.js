// eslint-disable-next-line import/prefer-default-export
export function calculateAbilityModifier(score) {
  if (typeof score !== 'number') return 0;
  if (score <= 1) return -5;
  if (score >= 30) return 10;
  return Math.floor((score - 10) / 2);
}
