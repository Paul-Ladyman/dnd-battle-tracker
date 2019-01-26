import React from 'react';
import Creature from './Creature';

function Creatures({creatures, activeCreature}) {
  return (
    creatures.map((creature, i) => {
      const active = activeCreature === i;
      return <Creature key={creature.id} creature={creature} active={active}/>
    })
  );
}

export default Creatures;