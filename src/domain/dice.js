const whiteSpace = /\s/g;
const multipliedDice = /(\d+)d(\d*)/g;
const dice = /d(\d*)/g;
const calculate = eval;

function validateLength(notation) {
  return notation.length <= 500;
}

function validateSyntax(notation) {
  return /^(\d|-[d\d]|\+[d\d]|d\d+)+$/g.test(notation);
}

function calculateTotal(total, expression) {
  return total + parseInt(expression, 10);
}

function validateTotalRolls(notation) {
  const multipliers = notation.match(/\d+d/g);
  if (!multipliers) return true;
  const totalRolls = multipliers
    .reduce((total, multiplier) => calculateTotal(total, multiplier.replace('d', '')), 0);
  return totalRolls <= 500;
}

function validateNotation(notation) {
  return validateLength(notation)
    && validateSyntax(notation)
    && validateTotalRolls(notation);
}

function rollDice(_, diceType) {
  return Math.floor(Math.random() * diceType + 1);
}

function expandMultipliedDice(_, multiplier, diceType) {
  const expandedDice = Array.from({ length: multiplier }).map(() => `d${diceType}`).join('+');
  return `(${expandedDice})`;
}

export default function roll(notation) {
  if (!notation) return { result: null };

  const standardisedNotation = notation.replace(whiteSpace, '').toLowerCase();

  if (!validateNotation(standardisedNotation)) return { result: new Error(`invalid dice notation: ${notation}`) };

  const equation = standardisedNotation
    .replace(multipliedDice, expandMultipliedDice)
    .replace(dice, rollDice);

  const result = calculate(equation);

  return { result };
}
