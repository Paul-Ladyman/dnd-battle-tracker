import React from 'react';
import HpIcon from '../../../icons/AddHpIcon';
import HealthPointsTool from '../tools/HealthPointsTool';
import MaxHitPointsTool from '../tools/MaxHitPointsTool';
import TemporaryHitPointsTool from '../tools/TemporaryHitPointsTool';

export function HpToolMenu({
  creature,
  creatureManagement,
}) {
  const {
    healthPoints,
    maxHealthPoints,
    temporaryHealthPoints,
    id,
    name,
  } = creature;
  const {
    damageCreature,
    healCreature,
    addHitPointsToCreature,
    addTemporaryHealthToCreature,
  } = creatureManagement;
  return (
    <div className="creature-toolbar--grid creature-toolbar--entrance">
      <HealthPointsTool
        name={name}
        id={id}
        healthPoints={healthPoints}
        maxHealthPoints={maxHealthPoints}
        temporaryHealthPoints={temporaryHealthPoints}
        damageCreature={damageCreature}
        healCreature={healCreature}
        showIfNoHp
      />
      <TemporaryHitPointsTool
        name={name}
        id={id}
        healthPoints={healthPoints}
        addTemporaryHealthToCreature={addTemporaryHealthToCreature}
      />
      <MaxHitPointsTool
        name={name}
        id={id}
        addHitPointsToCreature={addHitPointsToCreature}
      />
    </div>
  );
}

export function HpButton({
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
  focused,
  toolMenuId,
  toolMenuExpanded,
}) {
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const smallButtonClass = `${buttonClass}__small`;
  const focusedButtonClass = focused ? `${buttonClass}__focused` : '';
  return (
    <button
      className={`${textButtonClass} ${smallButtonClass} ${focusedButtonClass}`}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-haspopup="true"
      aria-controls={toolMenuId}
      aria-expanded={toolMenuExpanded}
    >
      <HpIcon />
      HP
    </button>
  );
}
