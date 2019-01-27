import React from 'react';

function CreatureToolbar({creature, killCreature}) {
  return (
    <div>
      <button onClick={() => killCreature(creature.id)}>Kill</button>
    </div>
  )
}

export default CreatureToolbar;