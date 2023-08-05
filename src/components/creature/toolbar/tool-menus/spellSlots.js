import React from 'react';
import SpellSlotsIcon from '../../../icons/SpellSlotsIcon';
import TabList from '../../../widgets/TabList';

export function SpellSlotsToolMenu({ toolMenuId }) {
  const tabs = ['Used', 'Total'];
  const labelledBy = `${toolMenuId}-spell-slots`;
  const id = `${toolMenuId}-spell-slots-tabs`;
  return (
    <TabList labelledBy={labelledBy} tabs={tabs} id={id} />
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
