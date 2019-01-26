import React from 'react';

function CollapsedCreature({creature}) {
  const healthPoints = creature.healthPoints ?
    ` ${creature.healthPoints}HP` :
    '';

  return (
    <div className="collapsed-creature centered__space-between">
      <div>{creature.name}</div>
      <div>{healthPoints}</div>
    </div>
  );
}

export default CollapsedCreature;