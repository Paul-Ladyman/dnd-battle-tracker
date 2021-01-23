import React, { useRef, useLayoutEffect } from 'react';
import CreatureToolbarInput from './CreatureToolbarInput';
import StabalizeIcon from '../icons/StabalizeIcon';
import KillIcon from '../icons/KillIcon';
import AddNoteIcon from '../icons/AddNoteIcon';
import HealIcon from '../icons/HealIcon';
import DamageIcon from '../icons/DamageIcon';
import InitiativeIcon from '../icons/InitiativeIcon';
import AddHpIcon from '../icons/AddHpIcon';
import { hotkeys } from '../../hotkeys/hotkeys';

function CreatureToolbar({
  creature,
  conditions,
  creatureManagement,
  focused,
}) {
  const buttonRef = useRef(null);
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

  const conditionsClasses = 'form--input creature-toolbar--select creature-toolbar--dropdown';
  const conditionsId = `conditions-${creature.id}`;

  useLayoutEffect(() => {
    if (focused) {
      buttonRef.current.focus();
    }
  }, [focused]);

  return (
    <div className="creature-toolbar">
      <button
        className={statusButtonClasses}
        aria-label={`${statusButtonTitle} ${name}`}
        title={statusButtonTitle}
        onClick={() => statusButtonFunc(id)}
        type="button"
        ref={buttonRef}
      >
        {statusButtonIcon}
      </button>
      {enableHealthItems
        && (
        <>
          <CreatureToolbarInput
            integer
            min={1}
            enabled={enableDamage}
            ariaLabel={`damage or heal ${name}`}
            label="Damage/Heal"
            leftSubmit={(damage) => damageCreature(id, damage)}
            leftHotkey={hotkeys.damageCreature}
            leftControls={{
              leftTitle: 'Damage',
              leftEnabled: enableDamage,
              LeftSubmitIcon: <DamageIcon />,
            }}
            rightSubmit={(health) => healCreature(id, health)}
            rightHotkey={hotkeys.healCreature}
            rightControls={{
              rightTitle: 'Heal',
              rightEnabled: enableHeal,
              RightSubmitIcon: <HealIcon />,
            }}
            inputId={`damage-${id}`}
          />
        </>
        )}
      {!enableHealthItems
        && (
        <CreatureToolbarInput
          integer
          name="creature-toolbar-maxhp"
          min={1}
          ariaLabel={`add max hp ${name}`}
          label="Add Max HP"
          rightSubmit={(health) => addHealthToCreature(id, health)}
          rightControls={{
            rightTitle: 'Add Max HP',
            RightSubmitIcon: <AddHpIcon />,
          }}
          inputId={`max-health-${id}`}
        />
        )}
      {enableInitiative
        && (
        <CreatureToolbarInput
          customClasses="creature-toolbar--last"
          integer
          ariaLabel={`add initiative to ${name}`}
          label="Initiative"
          rightSubmit={(initiativeInput) => addInitiativeToCreature(id, initiativeInput)}
          rightControls={{
            rightTitle: 'Initiative',
            RightSubmitIcon: <InitiativeIcon />,
          }}
          inputId={`initiative-${id}`}
        />
        )}
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
            {conditions.map((condition) => (
              <option key={`${conditionsId}-${condition}`} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </label>
      </div>
      <CreatureToolbarInput
        ariaLabel={`add note to ${name}`}
        label="Add Note"
        rightSubmit={(note) => addNoteToCreature(id, note, false)}
        rightControls={{
          rightTitle: 'Add Note',
          RightSubmitIcon: <AddNoteIcon />,
        }}
        inputId={`notes-${id}`}
      />
    </div>
  );
}

export default CreatureToolbar;
