import defaultState from '../../test/fixtures/battle';
import {
  findCreatureWithError,
  battleHasErrors,
  addError,
  dismissErrors,
  updateErrors,
  addInitiativeError,
} from './ErrorManager';

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

describe('addError', () => {
  test('adds a new error', () => {
    const state = {
      ...defaultState,
      errors: ['one', 'two', 'three'],
    };

    const result = addError(state, 'four');
    const expectedErrors = ['one', 'two', 'three', 'four'];
    expect(result).toEqual(expectedErrors);
  });

  test('does not add an error if it exists', () => {
    const errors = ['one', 'two', 'three'];
    const state = {
      ...defaultState,
      errors,
    };

    const result = addError(state, 'three');
    expect(result).toEqual(errors);
  });

  test('adds a new error with context', () => {
    const state = {
      ...defaultState,
      errors: ['one', 'two', 'three'],
    };

    const error = {
      type: 'InitiativeError',
      context: 0,
      message: 'error',
    };
    const result = addError(state, error);
    const expectedErrors = ['one', 'two', 'three', error];
    expect(result).toEqual(expectedErrors);
  });

  test('does not add an error with context if it already exists as a simple error', () => {
    const state = {
      ...defaultState,
      errors: ['one', 'two', 'three'],
    };

    const error = {
      type: 'InitiativeError',
      context: 0,
      message: 'three',
    };
    const result = addError(state, error);
    expect(result).toEqual(state.errors);
  });

  test('does not add an error with context if it already exists', () => {
    const error = {
      type: 'InitiativeError',
      context: 0,
      message: 'three',
    };
    const state = {
      ...defaultState,
      errors: ['one', 'two', error],
    };
    const result = addError(state, error);
    expect(result).toEqual(state.errors);
  });
});

describe('dismissErrors', () => {
  it('resets errors to an empty array', () => {
    const state = {
      ...defaultState,
      errors: ['one', 'two', 'three'],
    };

    const result = dismissErrors(state);
    expect(result).toEqual(defaultState);
  });

  it('does nothing if there are no errors', () => {
    const result = dismissErrors(defaultState);
    expect(result).toEqual(defaultState);
  });
});

describe('updateErrors', () => {
  test('adds a new error to state', () => {
    const state = {
      ...defaultState,
      errors: ['one', 'two', 'three'],
    };

    const result = updateErrors(state, 'four');
    const expectedErrors = ['one', 'two', 'three', 'four'];
    expect(result).toEqual({ ...state, errors: expectedErrors });
  });

  test('returns the existing state if an error if it exists', () => {
    const errors = ['one', 'two', 'three'];
    const state = {
      ...defaultState,
      errors,
    };

    const result = updateErrors(state, 'three');
    expect(result).toEqual(state);
  });
});

describe('addInitiativeError', () => {
  test('adds a new InitiativeError error', () => {
    const state = {
      ...defaultState,
      errors: [],
    };

    const result = addInitiativeError(state, 'goblin', 0);

    const expectedState = {
      ...state,
      ariaAnnouncements: ['Cannot continue battle; goblin has no initiative.'],
      errors: [{
        type: 'InitiativeError',
        context: 0,
        message: 'Cannot continue battle; goblin has no initiative.',
      }],
    };
    expect(result).toEqual(expectedState);
  });

  test('removes existing errors when adding a new InitiativeError error', () => {
    const state = {
      ...defaultState,
      errors: ['one', 'two'],
    };

    const result = addInitiativeError(state, 'goblin', 0);

    const expectedState = {
      ...state,
      ariaAnnouncements: ['Cannot continue battle; goblin has no initiative.'],
      errors: [{
        type: 'InitiativeError',
        context: 0,
        message: 'Cannot continue battle; goblin has no initiative.',
      }],
    };
    expect(result).toEqual(expectedState);
  });
});
