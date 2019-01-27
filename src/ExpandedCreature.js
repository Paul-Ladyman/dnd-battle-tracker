import React from 'react';

function ExpandedCreature({creature}) {
  const name = creature.alive ? creature.name : `${creature.name} (dead/unconscious)`;
  const showHealth = creature.healthPoints !== undefined;
  return (
    <div className="expanded-creature centered__columns">
      <div className="expanded-creature--name">{name}</div>
      {showHealth && <div className="expanded-creature--stat">Max Health: {creature.maxHealthPoints}</div>}
      {showHealth && <div className="expanded-creature--stat">Current Health: {creature.healthPoints}</div>}
      <div className="expanded-creature--stat">Initiative: {creature.initiative}</div>
    </div>
  );
}

export default ExpandedCreature;