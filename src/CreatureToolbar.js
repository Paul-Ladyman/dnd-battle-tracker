import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import ReviveIcon from './icons/ReviveIcon';
import KillIcon from './icons/KillIcon';

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
  const statusButtonTitle = creature.alive ? 'Kill/Make unconscious' : 'Stabalize';
  const statusButtonIcon = creature.alive ? <KillIcon /> : <ReviveIcon />;
  const statusButtonClass = 'creature-toolbar--button';
  const statusButtonClasses = creature.alive ? statusButtonClass : `${statusButtonClass} ${statusButtonClass}__dead`
  const enableHealthItems = creature.healthPoints !== undefined;
  const enableDamage = creature.healthPoints > 0;
  const enableHeal = creature.healthPoints < creature.maxHealthPoints;
  const enableConditions = conditions.length > 0;

  const enabledModifier = enableConditions ? '' : 'creature-toolbar--input__disabled';
  const conditionsClasses = `creature-toolbar--input creature-toolbar--dropdown ${enabledModifier}`;
  return (
    <div className="creature-toolbar">
      <button className={statusButtonClasses} title={statusButtonTitle} onClick={() => statusButtonFunc(creature.id)}>{statusButtonIcon}</button>
      <select
        className={conditionsClasses}
        disabled={!enableConditions}
        value=""
        onChange={(event) => addNoteToCreature(creature.id, event.target.value, true)}
      >
        <option value="">Add Condition</option>
        {conditions.map((condition, i) => {
          return <option key={i} value={condition}>{condition}</option>
        })}
      </select>
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
  )
}

export default CreatureToolbar;