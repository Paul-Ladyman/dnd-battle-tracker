import React from 'react';
import Creature from './Creature';
import CreatureToolbar from './CreatureToolbar';

function getAvailableConditions(allConditions, creatureConditions) {
  return allConditions.filter((condition) => {
    const activeConditionIndex = creatureConditions.findIndex((activeCondition) => {
      return activeCondition.text === condition;
    });
    return activeConditionIndex === -1;
  });
}

function Creatures({
  creatures,
  activeCreature,
  focusedCreature,
  conditions,
  round,
  secondsElapsed,
  creatureManagement
}) {
  return (
    <div className="creature-list centered__columns">
      {creatures.map((creature, i) => {
        const active = activeCreature === i;
        const focused = focusedCreature === i;
        return (
          <div key={creature.id}>
            <Creature
              creature={creature}
              active={active}
              focused={focused}
              round={round}
              secondsElapsed={secondsElapsed}
              creatureManagement={creatureManagement}
            />
            <CreatureToolbar
              creature={creature}
              conditions={getAvailableConditions(conditions, creature.conditions)}
              creatureManagement={creatureManagement}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Creatures;