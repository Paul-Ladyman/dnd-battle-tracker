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
  const statusButtonLabel = creature.alive ? 'KO' : 'Revive';
  const enableHealthItems = creature.healthPoints !== undefined;
  const enableConditions = conditions.length > 0;

  const enabledModifier = enableConditions ? 'creature-toolbar--dropdown' : 'creature-toolbar--input__disabled';
  const conditionsClasses = `creature-toolbar--input ${enabledModifier}`;
  return (
    <div className="creature-toolbar">
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
    </div>
  )
}

export default CreatureToolbar;