import getSecondsElapsed from './TimeManager';

const conditionData = {
  Blinded: {
    text: 'Blinded',
    id: 'blinded',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Blinded',
  },
  Charmed: {
    text: 'Charmed',
    id: 'charmed',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Charmed',
  },
  Deafened: {
    text: 'Deafened',
    id: 'deafened',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Deafened',
  },
  Exhaustion: {
    text: 'Exhaustion',
    id: 'exhaustion',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Exhaustion',
  },
  Frightened: {
    text: 'Frightened',
    id: 'frightened',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Frightened',
  },
  Grappled: {
    text: 'Grappled',
    id: 'grappled',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Grappled',
  },
  Incapacitated: {
    text: 'Incapacitated',
    id: 'incapacitated',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Incapacitated',
  },
  Invisible: {
    text: 'Invisible',
    id: 'invisible',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Invisible',
  },
  Paralyzed: {
    text: 'Paralyzed',
    id: 'paralyzed',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Paralyzed',
  },
  Petrified: {
    text: 'Petrified',
    id: 'petrified',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Petrified',
  },
  Poisoned: {
    text: 'Poisoned',
    id: 'poisoned',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Poisoned',
  },
  Prone: {
    text: 'Prone',
    id: 'prone',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Prone',
  },
  Restrained: {
    text: 'Restrained',
    id: 'restrained',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Restrained',
  },
  Stunned: {
    text: 'Stunned',
    id: 'stunned',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Stunned',
  },
  Unconscious: {
    text: 'Unconscious',
    id: 'unconscious',
    url: 'https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Unconscious',
  },
};

export const allConditions = {
  Blinded: 'Blinded',
  Charmed: 'Charmed',
  Deafened: 'Deafened',
  Exhaustion: 'Exhaustion',
  Frightened: 'Frightened',
  Grappled: 'Grappled',
  Incapacitated: 'Incapacitated',
  Invisible: 'Invisible',
  Paralyzed: 'Paralyzed',
  Petrified: 'Petrified',
  Poisoned: 'Poisoned',
  Prone: 'Prone',
  Restrained: 'Restrained',
  Stunned: 'Stunned',
  Unconscious: 'Unconscious',
};

function conditionExists(newConditionId, existingConditions) {
  return existingConditions.findIndex(
    (existingCondition) => existingCondition.id === newConditionId,
  ) > -1;
}

export function addCondition(conditionToAdd, creature, round) {
  const { conditions: existingConditions, id: creatureId } = creature;
  const conditionDataToAdd = conditionData[conditionToAdd];

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

export function getAvailableConditions(creature) {
  return Object.values(allConditions).filter((condition) => {
    const activeConditionIndex = creature.conditions.findIndex(
      (activeCondition) => activeCondition.text === condition,
    );
    return activeConditionIndex === -1;
  });
}
