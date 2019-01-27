import React from 'react';

function CollapsedCreature({creature}) {
  const name = creature.alive ? creature.name : `${creature.name} (dead/unconscious)`;
  return (
    <div className="collapsed-creature centered__space-between">
      <div className="collapsed-creature--name">{name}</div>
      {creature.healthPoints && <div>{creature.healthPoints}HP</div>}
    </div>
  );
}

export default CollapsedCreature;