import React from 'react';
import HealthPoints from './HealthPoints';

function CollapsedCreature({creature}) {
  const nameModifier = creature.alive ? '' : 'collapsed-creature--name__dead';
  const nameClasses = `collapsed-creature--name ${nameModifier}`
  const showConditions = creature.conditions.length > 0;
  const showNotes = creature.notes.length > 0;
  const showHealth = creature.healthPoints !== undefined;
  return (
    <div className="collapsed-creature">
      <div className={nameClasses}>{creature.name}</div>
      {showHealth && <HealthPoints
        short
        hp={creature.healthPoints}
        maxHp={creature.maxHealthPoints}
      />}
      {showConditions && 
        <div className="collapsed-creature--conditions">{
          creature.conditions.map((condition) => {
            return condition.text.substring(0, 2)
          }).join(', ')
          }
        </div>
      }
      {showNotes && <div>Notes...</div>}
    </div>
  );
}

export default CollapsedCreature;