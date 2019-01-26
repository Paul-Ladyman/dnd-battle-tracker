import React from 'react';

function Creature({creature}) {
  return (
    <div>{creature.name} ({creature.initiative}) {creature.healthPoints}HP</div>
  );
}

export default Creature;