import getSecondsElapsed from './TimeManager';

describe('getSecondsElapsed', () => {
  test('returns the seconds elapsed up to but not including the current round', () => {
    const result = getSecondsElapsed(2);
    expect(result).toBe(6);
  });

  test('returns 0 seconds for round 1', () => {
    const result = getSecondsElapsed(1);
    expect(result).toBe(0);
  });

  test('returns 0 seconds for round 0', () => {
    const result = getSecondsElapsed(0);
    expect(result).toBe(0);
  });

  test('returns 0 seconds for an invalid round', () => {
    const result = getSecondsElapsed(-1);
    expect(result).toBe(0);
  });

  test('returns 0 seconds when round is not specified', () => {
    const result = getSecondsElapsed(undefined);
    expect(result).toBe(0);
  });
});
