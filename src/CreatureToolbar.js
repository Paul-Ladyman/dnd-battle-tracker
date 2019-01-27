import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';

function CreatureToolbar({
  creature,
  killCreature,
  reviveCreature,
  damageCreature,
  healCreature
}) {
  const statusButtonFunc = creature.alive ? killCreature : reviveCreature;
  const statusButtonLabel = creature.alive ? 'Kill' : 'Revive';
  const showHealthItems = creature.healthPoints !== undefined;
  return (
    <div className="creature-toolbar">
      <button className="creature-toolbar--button" onClick={() => statusButtonFunc(creature.id)}>{statusButtonLabel}</button>
      {showHealthItems && <CreatureToolbarInput placeholder="damage" onSubmit={(damage) => damageCreature(creature.id, damage)}/>}
      {showHealthItems && <CreatureToolbarInput placeholder="heal" onSubmit={(heal) => healCreature(creature.id, heal)}/>}
    </div>
  )
}

export default CreatureToolbar;