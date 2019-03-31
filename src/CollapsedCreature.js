import React from 'react';
import HealthPoints from './HealthPoints';

function CollapsedCreature({creature}) {
  const nameModifier = creature.alive ? '' : 'collapsed-creature--name__dead';
  const nameClasses = `collapsed-creature--name ${nameModifier}`
  const showConditions = creature.conditions.length > 0;
  const showNotes = creature.notes.length > 0;
  const showHealth = creature.healthPoints !== undefined;
  const conditionsMarginClass = showHealth ? 'collapsed-creature--status__margin' : '';
  const notesMarginClass = showHealth || showConditions ? 'collapsed-creature--status__margin' : '';
  return (
    <div className="collapsed-creature">
      <div className={nameClasses}>{creature.name}</div>
      <div className="collapsed-creature--status">
        {showHealth && <HealthPoints
          short
          hp={creature.healthPoints}
          maxHp={creature.maxHealthPoints}
          className="collapsed-creature--health-points"
        />}
        {showConditions && 
          <div className={`collapsed-creature--conditions ${conditionsMarginClass}`}>{
            creature.conditions.map((condition) => {
              return condition.text
            }).join(', ')
            }
          </div>
        }
        {showNotes && 
          <div className={`collapsed-creature--notes ${notesMarginClass}`}>{
            creature.notes.map((note) => {
              return note.text
            }).join(', ')
          }
          </div>
        }
      </div>
    </div>
  );
}

export default CollapsedCreature;