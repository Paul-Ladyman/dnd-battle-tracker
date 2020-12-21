import getSecondsElapsed from './TimeManager';

describe('getSecondsElapsed', () => {
  test('returns the seconds elapsed up to but not including the current round', () => {
    const state = {
      round: 2,
    };
    const result = getSecondsElapsed(state);
    expect(result).toBe(6);
  });

  test('returns 0 seconds for round 1', () => {
    const state = {
      round: 1,
    };
    const result = getSecondsElapsed(state);
    expect(result).toBe(0);
  });

  test('returns 0 seconds for round 0', () => {
    const state = {
      round: 0,
    };
    const result = getSecondsElapsed(state);
    expect(result).toBe(0);
  });

  test('returns 0 seconds for an invalid round', () => {
    const state = {
      round: -1,
    };
    const result = getSecondsElapsed(state);
    expect(result).toBe(0);
  });

  test('returns 0 seconds when round is not specified', () => {
    const state = {};
    const result = getSecondsElapsed(state);
    expect(result).toBe(0);
  });
});
