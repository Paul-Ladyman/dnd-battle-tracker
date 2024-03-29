import React from 'react';
import SpellSlotsIcon from '../../../icons/SpellSlotsIcon';
import SpellSlotTool from '../tools/SpellSlotTool';

export function SpellSlotsToolMenu({
  creature,
  creatureManagement,
  toolMenuId,
}) {
  const { id, totalSpellSlots, usedSpellSlots } = creature;
  const { addTotalSpellSlots, addUsedSpellSlots } = creatureManagement;
  return (
    <div className="creature-toolbar--entrance">
      <SpellSlotTool
        creatureId={id}
        toolMenuId={toolMenuId}
        totalSpellSlots={totalSpellSlots}
        addTotalSpellSlots={addTotalSpellSlots}
        usedSpellSlots={usedSpellSlots}
        addUsedSpellSlots={addUsedSpellSlots}
      />
    </div>
  );
}

export function SpellSlotsButton({
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
  focused,
  toolMenuExpanded,
  toolMenuId,
}) {
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const focusedButtonClass = focused ? `${buttonClass}__focused` : '';
  return (
    <button
      className={`${textButtonClass} ${focusedButtonClass}`}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-haspopup="true"
      aria-controls={toolMenuId}
      aria-expanded={toolMenuExpanded}
      id={`${toolMenuId}-spell-slots`}
    >
      <SpellSlotsIcon />
      Spell Slots
    </button>
  );
}
