import React from 'react';

function ExpandedCreature({creature, active, removeCreature}) {
  const name = creature.alive ? creature.name : `${creature.name} (dead/unconscious)`;
  const showHealth = creature.healthPoints !== undefined;
  const {maxHealthPoints, healthPoints, initiative, id} = creature;
  return (
    <div className="expanded-creature centered__columns">
      <div className="expanded-creature--name">{name}</div>
      {showHealth && <div className="expanded-creature--stat">Max Health: {maxHealthPoints}</div>}
      {showHealth && <div className="expanded-creature--stat">Current Health: {healthPoints}</div>}
      <div className="expanded-creature--stat">Initiative: {initiative}</div>
      {!active && <button onClick={() => removeCreature(id)}>remove</button>}
    </div>
  );
}

export default ExpandedCreature;