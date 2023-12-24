import React from 'react';
import AcIcon from '../../../icons/AcIcon';
import AcTool from '../tools/AcTool';

export function AcToolMenu({
  creature,
  creatureManagement,
}) {
  const {
    id,
    name,
  } = creature;
  const {
    addArmorClassToCreature,
  } = creatureManagement;
  return (
    <div className="creature-toolbar--grid creature-toolbar--entrance">
      <AcTool name={name} id={id} addArmorClassToCreature={addArmorClassToCreature} />
    </div>
  );
}

export function AcButton({
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
      <AcIcon />
      AC
    </button>
  );
}
