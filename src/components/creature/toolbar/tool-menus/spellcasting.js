import React from 'react';
import SpellcastingIcon from '../../../icons/SpellcastingIcon';
import SpellcastingTool from '../tools/SpellcastingTool';

export function SpellcastingToolMenu({
  creature,
  creatureManagement,
  toolMenuId,
}) {
  const { id, totalSpellSlots, usedSpellSlots } = creature;
  const { addTotalSpellSlots, addUsedSpellSlots } = creatureManagement;
  return (
    <div className="creature-toolbar--entrance">
      <SpellcastingTool
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

export function SpellcastingButton({
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
      id={`${toolMenuId}-spellcasting`}
    >
      <SpellcastingIcon />
      Spellcasting
    </button>
  );
}
