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
