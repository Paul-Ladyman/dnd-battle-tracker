import React from 'react';
import CreatureWrapper from './CreatureWrapper';

function Creatures({
  creatures,
  activeCreature,
  focusedCreature,
  setFocus,
  conditions,
  round,
  secondsElapsed,
  creatureManagement
}) {
  return (
    <div className="creature-list">
      {creatures.map((creature, i) => {
        const active = activeCreature === i;
        const focused = focusedCreature === i;
        return (
          <React.Fragment key={creature.id}>
            <CreatureWrapper
              creature={creature}
              active={active}
              focused={focused}
              setFocus={setFocus}
              round={round}
              secondsElapsed={secondsElapsed}
              creatureManagement={creatureManagement}
              conditions={conditions}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Creatures;