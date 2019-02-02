import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';

function CreatureToolbar({
  creature,
  conditions,
  killCreature,
  reviveCreature,
  damageCreature,
  healCreature,
  addNoteToCreature
}) {
  const statusButtonFunc = creature.alive ? killCreature : reviveCreature;
  const statusButtonLabel = creature.alive ? 'Kill' : 'Revive';
  const showHealthItems = creature.healthPoints !== undefined;
  const showConditions = conditions.length > 0;
  return (
    <div className="creature-toolbar">
      <button className="creature-toolbar--button" onClick={() => statusButtonFunc(creature.id)}>{statusButtonLabel}</button>
      {showConditions &&
        <select value="" onChange={(event) => addNoteToCreature(creature.id, event.target.value, true)}>
          <option value="">--Conditions--</option>
          {conditions.map((condition, i) => {
            return <option key={i} value={condition}>{condition}</option>
          })}
        </select>
      }
      {showHealthItems && <CreatureToolbarInput integer placeholder="damage" onSubmit={(damage) => damageCreature(creature.id, damage)}/>}
      {showHealthItems && <CreatureToolbarInput integer placeholder="heal" onSubmit={(heal) => healCreature(creature.id, heal)}/>}
      <CreatureToolbarInput placeholder="note" onSubmit={(note) => addNoteToCreature(creature.id, note, false)} />
    </div>
  )
}

export default CreatureToolbar;