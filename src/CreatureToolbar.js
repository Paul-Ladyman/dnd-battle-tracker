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
  const conditionsClasses = `form--input creature-toolbar--input ${enabledModifier}`;
  return (
    <div className="creature-toolbar">
      <button className={statusButtonClasses} title={statusButtonTitle} onClick={() => statusButtonFunc(creature.id)}>{statusButtonIcon}</button>
      <div className="creature-toolbar--dropdown">
        <label>
          <div className="form--label">Add Condition</div>
          <select
            className={conditionsClasses}
            disabled={!enableConditions}
            value=""
            name="creature-toolbar-conditions"
            onChange={(event) => addNoteToCreature(creature.id, event.target.value, true)}
          >
            <option>--</option>
            {conditions.map((condition, i) => {
              return <option key={i} value={condition}>{condition}</option>
            })}
          </select>
        </label>
      </div>
      <CreatureToolbarInput label="Add Note" onSubmit={(note) => addNoteToCreature(creature.id, note, false)} />
      {enableHealthItems &&
        <React.Fragment>
          <CreatureToolbarInput integer enabled={enableDamage} label="Damage" onSubmit={(damage) => damageCreature(creature.id, damage)}/>
          <CreatureToolbarInput integer enabled={enableHeal} label="Heal" onSubmit={(heal) => healCreature(creature.id, heal)}/>
        </React.Fragment>
      }
      {!enableHealthItems &&
        <CreatureToolbarInput customClasses="creature-toolbar--last" integer name="creature-toolbar-maxhp" label="Add Max HP" onSubmit={(health) => addHealthToCreature(creature.id, health)}/>
      }
    </div>
  )
}

export default CreatureToolbar;