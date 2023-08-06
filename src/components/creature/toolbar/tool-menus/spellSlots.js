import React from 'react';
import SpellSlotsIcon from '../../../icons/SpellSlotsIcon';
import TabList from '../../../widgets/TabList';
import SpellSlotTool from '../tools/SpellSlotTool';

export function SpellSlotsToolMenu({
  creature,
  toolMenuId,
}) {
  const { id: creatureId } = creature;
  const tabs = ['Used', 'Total'];
  const panels = [
    <SpellSlotTool id="used" creatureId={creatureId} defaultValue={0} />,
    <SpellSlotTool id="total" creatureId={creatureId} defaultValue={null} />,
  ];
  const labelledBy = `${toolMenuId}-spell-slots`;
  const id = `${toolMenuId}-spell-slots-tabs`;
  return (
    <TabList labelledBy={labelledBy} tabs={tabs} panels={panels} id={id} customClasses="spell-slots-container" />
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
  const toolbarClass = 'new-creature-toolbar';
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
