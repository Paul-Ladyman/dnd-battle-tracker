import React from 'react';

function ExpandedCreature({creature, active, removeCreature, removeConditionFromCreature}) {
  const {alive, name, maxHealthPoints, healthPoints, initiative, id, conditions} = creature;
  const displayName = alive ? name : `${name} (dead/unconscious)`;
  const showHealth = healthPoints !== undefined;
  const showConditions = conditions.length > 0;

  return (
    <div className="expanded-creature centered__columns">
      <div className="expanded-creature--name">{displayName}</div>
      {showHealth && <div className="expanded-creature--stat">Max Health: {maxHealthPoints}</div>}
      {showHealth && <div className="expanded-creature--stat">Current Health: {healthPoints}</div>}
      <div className="expanded-creature--stat">Initiative: {initiative}</div>
      {!active && <button onClick={() => removeCreature(id)}>remove</button>}
      {showConditions && 
        <React.Fragment>
          <div>Conditions:</div>
          {creature.conditions.map((condition, i) => (
            <div key={i}>
              {condition.name}
              <button onClick={() => removeConditionFromCreature(id, condition.name)}>
                x
              </button>
            </div>
          ))}
        </React.Fragment>
      }
    </div>
  );
}

export default ExpandedCreature;