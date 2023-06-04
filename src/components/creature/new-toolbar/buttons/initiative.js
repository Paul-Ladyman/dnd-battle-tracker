import React from 'react';
import InitiativeIcon from '../../../icons/InitiativeIcon';
import InitiativeTool from '../../toolbar/InitiativeTool';

export function InitiativeToolMenu({
  creature,
  creatureManagement,
}) {
  const { name, id, initiative } = creature;
  const { addInitiativeToCreature } = creatureManagement;
  return (
    <div className="new-creature-toolbar">
      <InitiativeTool
        name={name}
        id={id}
        initiative={initiative}
        addInitiativeToCreature={addInitiativeToCreature}
        showIfNoInitiative
      />
    </div>
  );
}

export function InitiativeButton({
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
  focused,
}) {
  const toolbarClass = 'new-creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const mediumButtonClass = `${buttonClass}__medium`;
  const focusedButtonClass = focused ? `${buttonClass}__focused` : '';
  return (
    <button
      className={`${textButtonClass} ${mediumButtonClass} ${focusedButtonClass}`}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      <InitiativeIcon />
      Initiative
    </button>
  );
}
