import React from 'react';
import Creature from './Creature';
import CreatureToolbar from './CreatureToolbar';

function Creatures({creatures, activeCreature, killCreature, reviveCreature}) {
  return (
    <div className="creature-list centered__columns">
      {creatures.map((creature, i) => {
        const active = activeCreature === i;
        return (
          <React.Fragment>
            <Creature key={creature.id} creature={creature} active={active}/>
            <CreatureToolbar creature={creature} killCreature={killCreature} reviveCreature={reviveCreature}/>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Creatures;