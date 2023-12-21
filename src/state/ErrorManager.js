export function findCreatureWithError(state) {
  const creatureId = state.errors?.find((error) => error.type === 'InitiativeError')?.context;
  return creatureId !== undefined ? creatureId : null;
}

export function battleHasErrors(state) {
  return state.errors?.length > 0;
}
