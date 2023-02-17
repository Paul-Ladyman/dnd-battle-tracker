import { DiceRoll } from '@dice-roller/rpg-dice-roller';

export default function roll(diceNotation) {
  if (!diceNotation) return { result: null };
  try {
    const { total } = new DiceRoll(diceNotation);
    return { result: total };
  } catch (error) {
    return { result: error };
  }
}
