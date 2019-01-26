import React from 'react';

function ExpandedCreature({creature}) {
  const healthPoints = creature.healthPoints ?
    ` ${creature.healthPoints}HP` :
    '';

  return (
    <div className="expanded-creature centered__columns">
      <div>{creature.name}</div>
      <div>{healthPoints}</div>
      <div>Initiative: {creature.initiative}</div>
    </div>
  );
}

export default ExpandedCreature;