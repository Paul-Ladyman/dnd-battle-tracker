import { addError } from './ErrorManager';
import { validateSyntax } from '../domain/dice';

function isDefined(value) {
  return value !== undefined && value !== null && value !== '';
}

export function validateCreature(name, initiative, hitPoints, armorClass, quantity) {
  const nameError = name === '';
  const initiativeError = isDefined(initiative) && !validateSyntax(initiative);
  const healthError = isDefined(hitPoints)
    && (!validateSyntax(hitPoints) || parseInt(hitPoints, 10) <= 0);
  const intAc = parseInt(armorClass, 10);
  const acError = isDefined(armorClass) && (!Number.isInteger(intAc) || intAc <= 0);
  const quantityError = quantity <= 0 || quantity > 50;

  if (nameError || initiativeError || healthError || acError || quantityError) {
    return {
      nameError: nameError ? 'Name must be provided.' : false,
      initiativeError: initiativeError ? 'Initiative must be a number.' : false,
      healthError: healthError ? 'Health must be greater than 0.' : false,
      acError: acError ? 'AC must be greater than 0.' : false,
      quantityError: quantityError ? 'Quantity must be greater than 0 and less than 50.' : false,
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
