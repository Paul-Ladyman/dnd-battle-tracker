import getSecondsElapsed from './TimeManager';
import conditionsData from '../domain/conditions';

function conditionExists(newConditionId, existingConditions) {
  return existingConditions.findIndex(
    (existingCondition) => existingCondition.id === newConditionId,
  ) > -1;
}

export function addCondition(conditionToAdd, creature, round) {
  const { conditions: existingConditions, id: creatureId } = creature;
  const conditionDataToAdd = conditionsData[conditionToAdd];

  if (!conditionDataToAdd) {
    return existingConditions;
  }

  const { text, url, id } = conditionDataToAdd;
  const newConditionId = `${id}-${creatureId}`;

  if (conditionExists(newConditionId, existingConditions)) {
    return existingConditions;
  }

  const newCondition = {
    text,
    appliedAtRound: round,
    appliedAtSeconds: getSecondsElapsed(round),
    url,
    id: newConditionId,
  };
  return [...existingConditions, newCondition];
}

export function removeCondition(conditionToRemove, creature) {
  return creature.conditions.filter(({ text }) => text !== conditionToRemove);
}
