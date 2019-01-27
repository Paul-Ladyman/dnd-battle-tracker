import React from 'react';
import Creature from './Creature';
import CreatureToolbar from './CreatureToolbar';

function Creatures({creatures, activeCreature, killCreature, reviveCreature, damageCreature}) {
  return (
    <div className="creature-list centered__columns">
      {creatures.map((creature, i) => {
        const active = activeCreature === i;
        return (
          <div key={creature.id}>
            <Creature creature={creature} active={active}/>
            <CreatureToolbar
              creature={creature}
              killCreature={killCreature}
              reviveCreature={reviveCreature}
              damageCreature={damageCreature}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Creatures;