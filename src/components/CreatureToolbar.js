import React from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import StabalizeIcon from './icons/StabalizeIcon';
import KillIcon from './icons/KillIcon';
import AddNoteIcon from './icons/AddNoteIcon';
import HealIcon from './icons/HealIcon';
import DamageIcon from './icons/DamageIcon';
import InitiativeIcon from './icons/InitiativeIcon';
import AddHpIcon from './icons/AddHpIcon';

function CreatureToolbar({
  creature,
  conditions,
  creatureManagement,
}) {
  const {
    killCreature,
    stabalizeCreature,
    damageCreature,
    healCreature,
    addNoteToCreature,
    addHealthToCreature,
    addInitiativeToCreature,
  } = creatureManagement;
  const {
    alive, healthPoints, maxHealthPoints, id, name, initiative,
  } = creature;
  const statusButtonFunc = alive ? killCreature : stabalizeCreature;
  const statusButtonTitle = alive ? 'Kill/Make unconscious' : 'Stabalize';
  const statusButtonIcon = alive ? <KillIcon /> : <StabalizeIcon />;
  const statusButtonClass = 'creature-toolbar--button';
  const statusButtonClasses = alive ? statusButtonClass : `${statusButtonClass} ${statusButtonClass}__dead`;
  const enableHealthItems = healthPoints !== undefined;
  const enableDamage = healthPoints > 0;
  const enableHeal = healthPoints < maxHealthPoints;
  const enableConditions = conditions.length > 0;
  const enableInitiative = initiative === undefined;

  const enabledModifier = enableConditions ? '' : 'input-wrapper__disabled';
  const conditionsClasses = `form--input creature-toolbar--select creature-toolbar--dropdown ${enabledModifier}`;
  const conditionsId = `conditions-${creature.id}`;
  return (
    <div className="creature-toolbar">
      <button
        className={statusButtonClasses}
        aria-label={`${statusButtonTitle} ${name}`}
        title={statusButtonTitle}
        onClick={() => statusButtonFunc(id)}
        type="button"
      >
        {statusButtonIcon}
      </button>
      <div className="creature-toolbar--dropdown">
        <label htmlFor={conditionsId} aria-label={`add condition to ${name}`}>
          <div className="form--label">Add Condition</div>
          <select
            id={conditionsId}
            className={conditionsClasses}
            disabled={!enableConditions}
            value=""
            name="creature-toolbar-conditions"
            onChange={(event) => addNoteToCreature(id, event.target.value, true)}
          >
            <option>--</option>
            {conditions.map((condition, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <option key={i} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </label>
      </div>
      <CreatureToolbarInput
        ariaLabel={`add note to ${name}`}
        label="Add Note"
        onSubmit={(note) => addNoteToCreature(id, note, false)}
        SubmitIcon={<AddNoteIcon />}
      />
      {enableInitiative
        && (
        <CreatureToolbarInput
          integer
          ariaLabel={`add initiative to ${name}`}
          label="Initiative"
          onSubmit={(initiativeInput) => addInitiativeToCreature(id, initiativeInput)}
          SubmitIcon={<InitiativeIcon />}
        />
        )}
      {enableHealthItems
        && (
        <>
          <CreatureToolbarInput
            integer
            min={1}
            enabled={enableDamage}
            ariaLabel={`damage ${name}`}
            label="Damage"
            onSubmit={(damage) => damageCreature(id, damage)}
            SubmitIcon={<DamageIcon />}
          />
          <CreatureToolbarInput
            customClasses={enableInitiative ? 'creature-toolbar--last' : ''}
            integer
            min={1}
            enabled={enableHeal}
            ariaLabel={`heal ${name}`}
            label="Heal"
            onSubmit={(heal) => healCreature(id, heal)}
            SubmitIcon={<HealIcon />}
          />
        </>
        )}
      {!enableHealthItems
        && (
        <CreatureToolbarInput
          customClasses={enableInitiative ? '' : 'creature-toolbar--last'}
          integer
          name="creature-toolbar-maxhp"
          min={1}
          ariaLabel={`add max hp ${name}`}
          label="Add Max HP"
          onSubmit={(health) => addHealthToCreature(id, health)}
          SubmitIcon={<AddHpIcon />}
        />
        )}
    </div>
  );
}

export default CreatureToolbar;
