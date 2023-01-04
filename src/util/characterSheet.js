export const getProficiencyBonus = (score) => Math.max(Math.floor((score - 1) / 4), 0) + 2;

export const calculateAbilityModifier = (score) => Math.floor((score - 10) / 2);

export const getModifierSign = (modifier) => (modifier > 0 ? '+' : '');

export const getAbilityWithSign = (base) => {
  const abilityModifier = calculateAbilityModifier(base);

  return `(${getModifierSign(abilityModifier)}${abilityModifier})`;
};

export const capitalizeWord = (word) => word[0].toUpperCase() + word.slice(1);

export const beautifySnakeWord = (word) => {
  if (!word) return '';

  return word.split('_').map((line) => capitalizeWord(line)).join(' ');
};
