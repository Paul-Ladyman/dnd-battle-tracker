import React from 'react';
import Creature from './Creature';
import CreatureToolbar from './CreatureToolbar';

function getAvailableConditions(allConditions, creatureConditions) {
  return allConditions.filter((condition) => {
    const activeConditionIndex = creatureConditions.findIndex((activeCondition) => {
      return activeCondition.name === condition;
    });
    return activeConditionIndex === -1;
  });
}

function Creatures({
  creatures,
  activeCreature,
  conditions,
  killCreature,
  reviveCreature,
  damageCreature,
  healCreature,
  removeCreature,
  addConditionToCreature,
  removeConditionFromCreature
}) {
  return (
    <div className="creature-list centered__columns">
      {creatures.map((creature, i) => {
        const active = activeCreature === i;
        return (
          <div key={creature.id}>
            <Creature
              creature={creature}
              active={active}
              removeCreature={removeCreature}
              removeConditionFromCreature={removeConditionFromCreature}
            />
            <CreatureToolbar
              creature={creature}
              conditions={getAvailableConditions(conditions, creature.conditions)}
              killCreature={killCreature}
              reviveCreature={reviveCreature}
              damageCreature={damageCreature}
              healCreature={healCreature}
              addConditionToCreature={addConditionToCreature}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Creatures;