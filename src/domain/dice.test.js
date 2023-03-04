import roll from './dice';

beforeEach(() => {
  jest.spyOn(global.Math, 'random').mockReturnValue(0.999999);
});

afterEach(() => {
  jest.spyOn(global.Math, 'random').mockRestore();
});

describe('roll', () => {
  test('returns the result of a roll described by an integer', () => {
    const { result } = roll('20');
    expect(result).toBe(20);
  });

  test.each([
    ['d100', 100],
    ['1d100', 100],
    ['d20', 20],
    ['1d20', 20],
    ['d12', 12],
    ['1d12', 12],
    ['d10', 10],
    ['1d10', 10],
    ['d8', 8],
    ['1d8', 8],
    ['d6', 6],
    ['1d6', 6],
    ['d4', 4],
    ['1d4', 4],
  ])('returns the result of a single dice roll described by %p when Math.random returns close to 1', (notation, total) => {
    const { result } = roll(notation);
    expect(result).toBe(total);
  });

  test.each([
    ['d100', 51],
    ['d20', 11],
    ['d12', 7],
    ['d10', 6],
    ['d8', 5],
    ['d6', 4],
    ['d4', 3],
  ])('returns the result of a single dice roll described by %p when Math.random returns 0.5', (notation, total) => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    const { result } = roll(notation);
    expect(result).toBe(total);
  });

  test.each([
    ['d100', 1],
    ['d20', 1],
    ['d12', 1],
    ['d10', 1],
    ['d8', 1],
    ['d6', 1],
    ['d4', 1],
  ])('returns the result of a single dice roll described by %p when Math.random returns 0', (notation, total) => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    const { result } = roll(notation);
    expect(result).toBe(total);
  });

  test.each([
    [0.01, 1],
    [0.1, 1],
    [0.2, 2],
    [0.3, 2],
    [0.35, 3],
    [0.4, 3],
    [0.45, 3],
    [0.5, 4],
    [0.6, 4],
    [0.7, 5],
    [0.8, 5],
    [0.9, 6],
    [0.99, 6],
  ])('returns an approximately uniform distribution of integer results for dice rolls - Math.random returns %p', (random, total) => {
    jest.spyOn(global.Math, 'random').mockReturnValue(random);
    const { result } = roll('d6');
    expect(result).toBe(total);
  });

  test.each([
    ['D20', 20],
    ['1D20', 20],
  ])('allows capital D to be used in the notation', (notation, total) => {
    const { result } = roll(notation);
    expect(result).toBe(total);
  });

  test('returns the sum of one integer plus another', () => {
    const { result } = roll('2+2');
    expect(result).toBe(4);
  });

  test('returns the sum of one integer minus another', () => {
    const { result } = roll('2-2');
    expect(result).toBe(0);
  });

  test('allows negative results', () => {
    const { result } = roll('0-1');
    expect(result).toBe(-1);
  });

  test('returns the sum of a dice roll plus an integer', () => {
    const { result } = roll('d20+2');
    expect(result).toBe(22);
  });

  test('returns the sum of a dice roll minus an integer', () => {
    const { result } = roll('d20-2');
    expect(result).toBe(18);
  });

  test('returns the sum of multiple dice rolls of the same type', () => {
    const { result } = roll('2d20');
    expect(result).toBe(40);
  });

  test('returns the sum of multiple dice rolls of different types', () => {
    const { result } = roll('d20+d6');
    expect(result).toBe(26);
  });

  test('returns the sum of multiple dice rolls of different types with multipliers', () => {
    const { result } = roll('2d20+2d6');
    expect(result).toBe(52);
  });

  test('returns the sum of one dice roll minus another', () => {
    const { result } = roll('d20-d6');
    expect(result).toBe(14);
  });

  test('returns the sum of one multiplied dice roll minus another', () => {
    const { result } = roll('2d20-2d6');
    expect(result).toBe(28);
  });

  test('returns the sum of a complex dice notation', () => {
    const { result } = roll('2d20 - 3 + d6 + 1');
    expect(result).toBe(44);
  });

  test('allows white space in dice notation', () => {
    const { result } = roll('d20 + d6');
    expect(result).toBe(26);
  });

  test('returns null if the dice notation was an empty string', () => {
    const { result } = roll('');
    expect(result).toBeNull();
  });

  test('returns null if the dice notation was undefined', () => {
    const { result } = roll();
    expect(result).toBeNull();
  });

  test('returns an error object if the dice notation was invalid', () => {
    const { result } = roll('invalid');
    expect(result.message).toBe('invalid dice notation: invalid');
  });

  test('returns an error object if a + is not followed by a valid character', () => {
    const { result } = roll('+');
    expect(result.message).toBe('invalid dice notation: +');
  });

  test('returns an error object if a - is not followed by a valid character', () => {
    const { result } = roll('-');
    expect(result.message).toBe('invalid dice notation: -');
  });

  test('returns an error object if a d is not followed by a valid character', () => {
    const { result } = roll('d');
    expect(result.message).toBe('invalid dice notation: d');
  });

  test('returns an error object if the dice notation was too long', () => {
    const notation = `
      d100+d100+d100+d100+d100+d100+d100+d100+d100+d100+
      d100+d100+d100+d100+d100+d100+d100+d100+d100+d100+
      d100+d100+d100+d100+d100+d100+d100+d100+d100+d100+
      d100+d100+d100+d100+d100+d100+d100+d100+d100+d100+
      d100+d100+d100+d100+d100+d100+d100+d100+d100+d100+
      d100+d100+d100+d100+d100+d100+d100+d100+d100+d100+
      d100+d100+d100+d100+d100+d100+d100+d100+d100+d100+
      d100+d100+d100+d100+d100+d100+d100+d100+d100+d100+
      d100+d100+d100+d100+d100+d100+d100+d100+d100+d100+
      d100+d100+d100+d100+d100+d100+d100+d100+d100+d100+d100
    `.replace(/\s/g, '');
    const { result } = roll(notation);
    expect(result.message).toContain('invalid dice notation');
  });

  test('returns an error object if the multiplier for a single dice is greater than 500', () => {
    const { result } = roll('501d6');
    expect(result.message).toBe('invalid dice notation: 501d6');
  });

  test('returns an error object if the multipliers for multiple dice add to greater than 500', () => {
    const { result } = roll('500d6 + 1d20');
    expect(result.message).toBe('invalid dice notation: 500d6 + 1d20');
  });
});
