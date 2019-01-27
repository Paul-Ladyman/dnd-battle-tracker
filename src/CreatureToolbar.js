import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';

function CreatureToolbar({creature, killCreature, reviveCreature, damageCreature}) {
  const statusButtonFunc = creature.alive ? killCreature : reviveCreature;
  const statusButtonLabel = creature.alive ? 'Kill' : 'Revive';
  const showHealthItems = creature.healthPoints !== undefined;
  return (
    <div>
      <button onClick={() => statusButtonFunc(creature.id)}>{statusButtonLabel}</button>
      {showHealthItems && <CreatureToolbarInput onSubmit={(damage) => damageCreature(creature.id, damage)}/>}
    </div>
  )
}

export default CreatureToolbar;