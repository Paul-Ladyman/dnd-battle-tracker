import React from 'react';

function CollapsedCreature({creature}) {
  return (
    <div className="collapsed-creature centered__space-between">
      <div className="collapsed-creature--name">{creature.name}</div>
      {creature.healthPoints && <div>{creature.healthPoints}HP</div>}
    </div>
  );
}

export default CollapsedCreature;