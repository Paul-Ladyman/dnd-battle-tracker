import React from 'react';
import Creature from './Creature';

function Creatures({creatures, activeCreature}) {
  return (
    <div className="creature-list centered__columns">
      {creatures.map((creature, i) => {
        const active = activeCreature === i;
        return <Creature key={creature.id} creature={creature} active={active}/>
      })}
    </div>
  );
}

export default Creatures;