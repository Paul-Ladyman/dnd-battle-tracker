import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';

function CreatureToolbar({
  creature,
  conditions,
  killCreature,
  reviveCreature,
  damageCreature,
  healCreature,
  addConditionToCreature
}) {
  const statusButtonFunc = creature.alive ? killCreature : reviveCreature;
  const statusButtonLabel = creature.alive ? 'Kill' : 'Revive';
  const showHealthItems = creature.healthPoints !== undefined;
  const showConditions = conditions.length > 0;
  return (
    <div className="creature-toolbar">
      <button className="creature-toolbar--button" onClick={() => statusButtonFunc(creature.id)}>{statusButtonLabel}</button>
      {showConditions &&
        <select value="" onChange={(event) => addConditionToCreature(creature.id, event.target.value)}>
          <option value="">--Conditions--</option>
          {conditions.map((condition) => {
            return <option value={condition}>{condition}</option>
          })}
        </select>
      }
      {showHealthItems && <CreatureToolbarInput placeholder="damage" onSubmit={(damage) => damageCreature(creature.id, damage)}/>}
      {showHealthItems && <CreatureToolbarInput placeholder="heal" onSubmit={(heal) => healCreature(creature.id, heal)}/>}
    </div>
  )
}

export default CreatureToolbar;