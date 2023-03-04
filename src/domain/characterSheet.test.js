import { calculateAbilityModifier } from './characterSheet';

describe('calculateAbilityModifier', () => {
  test.each([
    [-5, 1],
    [-4, 2],
    [-4, 3],
    [-3, 4],
    [-3, 5],
    [-2, 6],
    [-2, 7],
    [-1, 8],
    [-1, 9],
    [0, 10],
    [0, 11],
    [1, 12],
    [1, 13],
    [2, 14],
    [2, 15],
    [3, 16],
    [3, 17],
    [4, 18],
    [4, 19],
    [5, 20],
    [5, 21],
    [6, 22],
    [6, 23],
    [7, 24],
    [7, 25],
    [8, 26],
    [8, 27],
    [9, 28],
    [9, 29],
    [10, 30],
  ])('returns a modifier of %i for an ability score of %i', (modifier, abilityScore) => {
    expect(calculateAbilityModifier(abilityScore)).toBe(modifier);
  });

  it('returns a modifier of -5 for an ability score of 0', () => {
    expect(calculateAbilityModifier(0)).toBe(-5);
  });

  it('returns a modifier of -5 for an ability score of -1', () => {
    expect(calculateAbilityModifier(-1)).toBe(-5);
  });

  it('returns a modifier of 10 for an ability score of 100', () => {
    expect(calculateAbilityModifier(100)).toBe(10);
  });

  it('returns a modifier of 0 if the ability score is undefined', () => {
    expect(calculateAbilityModifier()).toBe(0);
  });

  it('returns a modifier of 0 if the ability score is null', () => {
    expect(calculateAbilityModifier(null)).toBe(0);
  });

  it('returns a modifier of 0 if the ability score is not a number', () => {
    expect(calculateAbilityModifier('one')).toBe(0);
  });
});
