import React from 'react';

function CollapsedCreature({creature}) {
  const nameModifier = creature.alive ? '' : 'collapsed-creature--name__dead';
  const classes = `collapsed-creature--name ${nameModifier}`
  return (
    <div className="collapsed-creature centered__space-between">
      <div className={classes}>{creature.name}</div>
      {creature.healthPoints && <div>{creature.healthPoints}HP</div>}
    </div>
  );
}

export default CollapsedCreature;