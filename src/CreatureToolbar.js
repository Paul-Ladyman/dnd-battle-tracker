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
    addNoteToCreature,
    addHealthToCreature
  } = creatureManagement;
  const statusButtonFunc = creature.alive ? killCreature : reviveCreature;
  const statusButtonLabel = creature.alive ? 'KO' : 'Revive';
  const enableHealthItems = creature.healthPoints !== undefined;
  const enableDamage = creature.healthPoints > 0;
  const enableHeal = creature.healthPoints < creature.maxHealthPoints;
  const enableConditions = conditions.length > 0;

  const toolbarClass = 'creature-toolbar'
  const toolbarClasses = enableHealthItems ?
    `${toolbarClass} creature-toolbar--5-cols` :
    `${toolbarClass} creature-toolbar--4-cols`;
  const enabledModifier = enableConditions ? 'creature-toolbar--dropdown' : 'creature-toolbar--input__disabled';
  const conditionsClasses = `creature-toolbar--input ${enabledModifier}`;
  return (
    <div className={toolbarClasses}>
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
      {enableHealthItems &&
        <React.Fragment>
          <CreatureToolbarInput integer enabled={enableDamage} placeholder="Damage" onSubmit={(damage) => damageCreature(creature.id, damage)}/>
          <CreatureToolbarInput integer enabled={enableHeal} placeholder="Heal" onSubmit={(heal) => healCreature(creature.id, heal)}/>
        </React.Fragment>
      }
      {!enableHealthItems &&
        <CreatureToolbarInput integer placeholder="Add HP" onSubmit={(health) => addHealthToCreature(creature.id, health)}/>
      }
    </div>
  )
}

export default CreatureToolbar;