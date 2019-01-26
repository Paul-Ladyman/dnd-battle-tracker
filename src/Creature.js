import React from 'react';

function Creature({creature, active}) {
  const activeSign = active ? '> ' : '';
  const healthPoints = creature.healthPoints ?
    ` ${creature.healthPoints}HP` :
    '';

  return (
    <div>{activeSign}{creature.name} ({creature.initiative}){healthPoints}</div>
  );
}

export default Creature;