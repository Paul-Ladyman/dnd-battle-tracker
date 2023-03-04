import { addError } from './AppManager';
import { validateSyntax } from '../domain/dice';

export function validateCreature(name, initiative, healthPoints, multiplier) {
  const nameError = name === '';
  const initiativeIsDefined = initiative !== undefined && initiative !== null && initiative !== '';
  const initiativeError = initiativeIsDefined && !validateSyntax(initiative);
  const healthError = healthPoints <= 0;
  const multiplierError = multiplier <= 0 || multiplier > 50;

  if (nameError || initiativeError || healthError || multiplierError) {
    return {
      nameError: nameError ? 'Name must be provided.' : false,
      initiativeError: initiativeError ? 'Initiative must be a number.' : false,
      healthError: healthError ? 'Health must be greater than 0.' : false,
      multiplierError: multiplierError ? 'Multiplier must be greater than 0 and less than 50.' : false,
    };
  }

  return undefined;
}

export function handleCreateCreatureErrors(state, createCreatureErrors) {
  const createCreatureErrorMessages = Object.keys(createCreatureErrors)
    .filter((error) => createCreatureErrors[error])
    .map((error) => createCreatureErrors[error])
    .join('. ');

  const ariaAnnouncements = state.ariaAnnouncements.concat(`Failed to create creature. ${createCreatureErrorMessages}`);
  const errors = addError(state, 'Failed to create creature. Create creature form is invalid.');
  return {
    ...state, ariaAnnouncements, errors, createCreatureErrors,
  };
}
