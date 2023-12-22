export function findCreatureWithError(state) {
  const creatureId = state.errors?.find((error) => error.type === 'InitiativeError')?.context;
  return creatureId !== undefined ? creatureId : null;
}

export function battleHasErrors(state) {
  return state.errors?.length > 0;
}

export function addError(state, errorToAdd) {
  const errorExists = state.errors.find(
    (error) => error === errorToAdd || error === errorToAdd.message,
  );

  if (errorExists) {
    return state.errors;
  }

  return state.errors.concat(errorToAdd);
}

export function dismissErrors(state) {
  return {
    ...state,
    errors: [],
  };
}

export function updateErrors(state, errorToAdd) {
  const errors = addError(state, errorToAdd);
  return { ...state, errors };
}

export function addInitiativeError(state, creatureName, creatureId) {
  const message = `Cannot continue battle; ${creatureName} has no initiative.`;
  const ariaAnnouncements = state.ariaAnnouncements.concat(message);
  const error = {
    type: 'InitiativeError',
    context: creatureId,
    message,
  };
  return { ...state, errors: [error], ariaAnnouncements };
}
