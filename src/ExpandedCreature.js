import React from 'react';

function ExpandedCreature({creature}) {
  const healthPoints = creature.healthPoints ?
    ` ${creature.healthPoints}HP` :
    '';

  return (
    <div>
      {creature.name} {healthPoints}
      <div>Initiative: {creature.initiative}</div>
    </div>
  );
}

export default ExpandedCreature;