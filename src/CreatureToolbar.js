import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';

function CreatureToolbar({
  creature,
  conditions,
  creatureManagement
}) {
  const {
    killCreature,
    reviveCreature,
    damageCreature,
    healCreature,
    addNoteToCreature
  } = creatureManagement;
  const statusButtonFunc = creature.alive ? killCreature : reviveCreature;
  const statusButtonLabel = creature.alive ? 'KO' : 'Revive';
  const enableHealthItems = creature.healthPoints !== undefined;
  const enableConditions = conditions.length > 0;

  const enabledModifier = enableConditions ? 'creature-toolbar--dropdown' : 'creature-toolbar--input__disabled';
  const conditionsClasses = `creature-toolbar--input ${enabledModifier}`;
  return (
    <div className="creature-toolbar">
      {creature.editing ||
      <React.Fragment>
      <button className="creature-toolbar--button" onClick={() => statusButtonFunc(creature.id)}>{statusButtonLabel}</button>
      <select
        className={conditionsClasses}
        disabled={!enableConditions}
        value=""
        onChange={(event) => addNoteToCreature(creature.id, event.target.value, true)}
      >
        <option value="">Conditions</option>
        {conditions.map((condition, i) => {
          return <option key={i} value={condition}>{condition}</option>
        })}
      </select>
      <CreatureToolbarInput placeholder="Note" onSubmit={(note) => addNoteToCreature(creature.id, note, false)} />
      <CreatureToolbarInput integer enabled={enableHealthItems} placeholder="Damage" onSubmit={(damage) => damageCreature(creature.id, damage)}/>
      <CreatureToolbarInput integer enabled={enableHealthItems} placeholder="Heal" onSubmit={(heal) => healCreature(creature.id, heal)}/>
      </React.Fragment>
      }
      {creature.editing &&
        <div>Editing...</div>
      }
    </div>
  )
}

export default CreatureToolbar;