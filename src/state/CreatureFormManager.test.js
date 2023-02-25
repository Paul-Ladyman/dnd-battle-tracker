import { validateCreature, handleCreateCreatureErrors } from './CreatureFormManager';
import defaultState from '../../test/fixtures/battle';

describe('validateCreature', () => {
  test('returns undefined if creature is valid', () => {
    expect(validateCreature('a', '1', 1, 1)).toEqual(undefined);
  });

  test('accepts initiative as dice notation', () => {
    expect(validateCreature('a', 'd20', 1, 1)).toEqual(undefined);
  });

  test.each([
    [undefined],
    [null],
    [''],
  ])('initiative is optional: %p', (initiative) => {
    expect(validateCreature('a', initiative, 1, 1)).toEqual(undefined);
  });

  test('health is optional', () => {
    expect(validateCreature('a', '1', undefined, 1)).toEqual(undefined);
  });

  test('name must be non-empty', () => {
    const expectedErrors = {
      nameError: 'Name must be provided.',
      initiativeError: false,
      healthError: false,
      multiplierError: false,
    };
    expect(validateCreature('', '1', 1, 1)).toEqual(expectedErrors);
  });

  test.each([
    [NaN],
    ['a'],
    [new Error('initiative error')],
  ])('initiative must be a number if non-empty: %p', (initiative) => {
    const expectedErrors = {
      nameError: false,
      initiativeError: 'Initiative must be a number.',
      healthError: false,
      multiplierError: false,
    };
    expect(validateCreature('a', initiative, 1, 1)).toEqual(expectedErrors);
  });

  test('health must be greater than 0', () => {
    const expectedErrors = {
      nameError: false,
      initiativeError: false,
      healthError: 'Health must be greater than 0.',
      multiplierError: false,
    };
    expect(validateCreature('a', 1, 0, 1)).toEqual(expectedErrors);
  });

  test('multiplier must be greater than 0', () => {
    const expectedErrors = {
      nameError: false,
      initiativeError: false,
      healthError: false,
      multiplierError: 'Multiplier must be greater than 0 and less than 50.',
    };
    expect(validateCreature('a', 1, 1, 0)).toEqual(expectedErrors);
  });

  test('multiplier must be less than 51', () => {
    const expectedErrors = {
      nameError: false,
      initiativeError: false,
      healthError: false,
      multiplierError: 'Multiplier must be greater than 0 and less than 50.',
    };
    expect(validateCreature('a', 1, 1, 51)).toEqual(expectedErrors);
  });
});

describe('handleCreateCreatureErrors', () => {
  it('adds errors to state', () => {
    const errors = { nameError: 'some error' };

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['Failed to create creature. some error'],
      errors: ['Failed to create creature. Create creature form is invalid.'],
      createCreatureErrors: { nameError: 'some error' },
    };

    expect(handleCreateCreatureErrors(defaultState, errors)).toEqual(expectedState);
  });
});
