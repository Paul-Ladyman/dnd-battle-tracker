import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import StabalizeIcon from './icons/StabalizeIcon';
import KillIcon from './icons/KillIcon';

function CreatureToolbar({
  creature,
  conditions,
  creatureManagement
}) {
  const {
    killCreature,
    stabalizeCreature,
    damageCreature,
    healCreature,
    addNoteToCreature,
    addHealthToCreature
  } = creatureManagement;
  const statusButtonFunc = creature.alive ? killCreature : stabalizeCreature;
  const statusButtonTitle = creature.alive ? 'Kill/Make unconscious' : 'Stabalize';
  const statusButtonIcon = creature.alive ? <KillIcon /> : <StabalizeIcon />;
  const statusButtonClass = 'creature-toolbar--button';
  const statusButtonClasses = creature.alive ? statusButtonClass : `${statusButtonClass} ${statusButtonClass}__dead`
  const enableHealthItems = creature.healthPoints !== undefined;
  const enableDamage = creature.healthPoints > 0;
  const enableHeal = creature.healthPoints < creature.maxHealthPoints;
  const enableConditions = conditions.length > 0;

  const enabledModifier = enableConditions ? '' : 'creature-toolbar--input__disabled';
  const conditionsClasses = `creature-toolbar--input ${enabledModifier}`;
  return (
    <div style={{display: 'flex'}}>
      <button className={statusButtonClasses} title={statusButtonTitle} onClick={() => statusButtonFunc(creature.id)}>{statusButtonIcon}</button>
      <div className="creature-toolbar">
        <div className="creature-toolbar--dropdown">
          <label>Add Condition</label>
        <select
          className={conditionsClasses}
          disabled={!enableConditions}
          value=""
          onChange={(event) => addNoteToCreature(creature.id, event.target.value, true)}
        >
          <option>--Conditions--</option>
          {conditions.map((condition, i) => {
            return <option key={i} value={condition}>{condition}</option>
          })}
        </select>
        </div>
        <CreatureToolbarInput placeholder="Add Note" onSubmit={(note) => addNoteToCreature(creature.id, note, false)} />
        {enableHealthItems &&
          <React.Fragment>
            <CreatureToolbarInput integer enabled={enableDamage} placeholder="Damage" onSubmit={(damage) => damageCreature(creature.id, damage)}/>
            <CreatureToolbarInput integer enabled={enableHeal} placeholder="Heal" onSubmit={(heal) => healCreature(creature.id, heal)}/>
          </React.Fragment>
        }
        {!enableHealthItems &&
          <CreatureToolbarInput customClasses="creature-toolbar--last" integer placeholder="Add Max HP" onSubmit={(health) => addHealthToCreature(creature.id, health)}/>
        }
      </div>
    </div>
  )
}

export default CreatureToolbar;