import React from 'react';
import Creature from './Creature';

function sortCreatures(creatures) {
  return creatures.sort((creatureA, creatureB) => {
    return creatureB.initiative - creatureA.initiative;
  });
}
function Creatures({creatures}) {
  return (
    sortCreatures(creatures).map((creature) => {
      return <Creature creature={creature} />
    })
  );
}

export default Creatures;