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
  conditions,
  round,
  secondsElapsed,
  killCreature,
  reviveCreature,
  damageCreature,
  healCreature,
  removeCreature,
  addNoteToCreature,
  removeNoteFromCreature
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
              round={round}
              secondsElapsed={secondsElapsed}
              removeCreature={removeCreature}
              removeNoteFromCreature={removeNoteFromCreature}
            />
            <CreatureToolbar
              creature={creature}
              conditions={getAvailableConditions(conditions, creature.conditions)}
              killCreature={killCreature}
              reviveCreature={reviveCreature}
              damageCreature={damageCreature}
              healCreature={healCreature}
              addNoteToCreature={addNoteToCreature}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Creatures;