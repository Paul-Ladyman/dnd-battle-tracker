import roll from './dice';

describe('roll', () => {
  test('returns the result of a roll described by dice notation', () => {
    const { result } = roll('1d20');
    expect(result).toBeGreaterThan(0);
  });

  test('returns null if the dice notation was an empty string', () => {
    const { result } = roll('');
    expect(result).toBeNull();
  });

  test('returns null if the dice notation was undefined', () => {
    const { result } = roll();
    expect(result).toBeNull();
  });

  test('returns an error if the dice notation was invalid', () => {
    const { result } = roll('d');
    expect(result.message).toBeDefined();
    expect(result.stack).toBeDefined();
  });
});
