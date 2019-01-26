import React from 'react';

function ExpandedCreature({creature}) {
  return (
    <div className="expanded-creature centered__columns">
      <div className="expanded-creature--name">{creature.name}</div>
      {creature.healthPoints && <div className="expanded-creature--stat">Health: {creature.healthPoints}</div>}
      <div className="expanded-creature--stat">Initiative: {creature.initiative}</div>
    </div>
  );
}

export default ExpandedCreature;