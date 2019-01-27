import React from 'react';

function CreatureToolbar({creature, killCreature, reviveCreature}) {
  const statusButtonFunc = creature.alive ? killCreature : reviveCreature;
  const statusButtonLabel = creature.alive ? 'Kill' : 'Revive';
  return (
    <div>
      <button onClick={() => statusButtonFunc(creature.id)}>{statusButtonLabel}</button>
    </div>
  )
}

export default CreatureToolbar;