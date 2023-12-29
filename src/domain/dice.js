import random from '../util/random';

const whiteSpace = /\s/g;
const multipliedDice = /(\d+)?d(\d*)/;
const operators = ['+', '-'];
const calculate = eval;

function validateLength(notation) {
  return notation.length <= 500;
}

export function validateSyntax(notation) {
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

function rollDice(diceType) {
  return Math.floor(random() * diceType + 1).toString();
}

function rollAllDice(term) {
  const [_, multiplier, diceType] = term.match(multipliedDice);
  return Array.from({ length: multiplier || 1 }).map(() => rollDice(diceType));
}

function getRawTerms(notation) {
  return Array.from(notation)
    .reduce((terms, char) => {
      const currentTerm = terms[terms.length - 1];
      const isNewTerm = currentTerm === undefined
        || operators.includes(currentTerm)
        || operators.includes(char);

      if (isNewTerm) return [...terms, char];

      const updatedTerm = `${currentTerm}${char}`;
      const otherTerms = terms.slice(0, -1);
      return [...otherTerms, updatedTerm];
    }, []);
}

function parseRawTerms(terms) {
  return terms.map((term) => {
    if (term.includes('d')) {
      return {
        type: 'dice',
        term,
        rolls: rollAllDice(term),
      };
    }

    const type = operators.includes(term) ? 'operator' : 'integer';
    return {
      type,
      term,
    };
  });
}

function calculateResult(terms) {
  const equation = terms.reduce((acc, term) => {
    if (term.type === 'integer' || term.type === 'operator') {
      return `${acc}${term.term}`;
    }
    return `${acc}(${term.rolls.join('+')})`;
  }, '');

  return calculate(equation);
}

export default function roll(notation) {
  if (notation === undefined || notation === '') return { result: null };

  const standardisedNotation = notation.toString().replace(whiteSpace, '').toLowerCase();

  if (!validateNotation(standardisedNotation)) return { result: new Error(`invalid dice notation: ${notation}`) };

  const rawTerms = getRawTerms(standardisedNotation);
  const terms = parseRawTerms(rawTerms);
  const result = calculateResult(terms);
  return { result, terms };
}
