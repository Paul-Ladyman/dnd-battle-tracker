import React from 'react';

function CollapsedCreature({creature}) {
  const healthPoints = creature.healthPoints ?
    ` ${creature.healthPoints}HP` :
    '';

  return (
    <div>{creature.name} {healthPoints}</div>
  );
}

export default CollapsedCreature;