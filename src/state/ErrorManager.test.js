import defaultState from '../../test/fixtures/battle';
import { findCreatureWithError, battleHasErrors } from './ErrorManager';

describe('findCreatureWithError', () => {
  test('returns the context of an InitiativeError if it exists', () => {
    const state = {
      ...defaultState,
      errors: ['one', {
        type: 'InitiativeError',
        context: 0,
        message: 'error',
      }, 'three'],
    };
    const result = findCreatureWithError(state);
    expect(result).toBe(0);
  });

  test('returns the context of the first InitiativeError if there are multiple', () => {
    const state = {
      ...defaultState,
      errors: ['one', {
        type: 'InitiativeError',
        context: 0,
        message: 'error',
      }, {
        type: 'InitiativeError',
        context: 1,
        message: 'error',
      }],
    };
    const result = findCreatureWithError(state);
    expect(result).toBe(0);
  });

  test('returns null if there are no errors', () => {
    const state = {
      ...defaultState,
      errors: [],
    };
    const result = findCreatureWithError(state);
    expect(result).toBeNull();
  });

  test('returns null if errors does not exist', () => {
    const state = {
      ...defaultState,
      errors: undefined,
    };
    const result = findCreatureWithError(state);
    expect(result).toBeNull();
  });
});

describe('battleHasErrors', () => {
  test('returns true if the battle has errors', () => {
    const state = {
      ...defaultState,
      errors: ['one'],
    };
    const result = battleHasErrors(state);
    expect(result).toBe(true);
  });

  test('returns false if the battle has no errors', () => {
    const state = {
      ...defaultState,
      errors: [],
    };
    const result = battleHasErrors(state);
    expect(result).toBe(false);
  });

  test('returns false if errors does not exist', () => {
    const state = {
      ...defaultState,
      errors: undefined,
    };
    const result = battleHasErrors(state);
    expect(result).toBe(false);
  });
});
