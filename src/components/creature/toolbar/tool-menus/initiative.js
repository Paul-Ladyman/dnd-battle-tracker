import React from 'react';
import InitiativeIcon from '../../../icons/InitiativeIcon';
import InitiativeTool from '../tools/InitiativeTool';
import TieBreakerTool from '../tools/TieBreakerTool';

export function InitiativeToolMenu({
  creature,
  active,
  creatureManagement,
}) {
  const { name, id } = creature;
  const { addInitiativeToCreature, addTieBreakerToCreature } = creatureManagement;
  return (
    <div className="creature-toolbar--grid creature-toolbar--entrance">
      <InitiativeTool
        active={active}
        name={name}
        id={id}
        addInitiativeToCreature={addInitiativeToCreature}
      />
      <TieBreakerTool
        active={active}
        name={name}
        id={id}
        addTieBreakerToCreature={addTieBreakerToCreature}
      />
    </div>
  );
}

export function InitiativeButton({
  active,
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
  focused,
  closeToolMenu,
  toolMenuId,
  toolMenuExpanded,
}) {
  const enabled = !active;
  const ariaDisabled = enabled ? 'false' : 'true';
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const mediumButtonClass = `${buttonClass}__medium`;
  const focusedButtonClass = focused ? `${buttonClass}__focused` : '';

  const initiativeOnClick = () => {
    if (enabled) {
      onClick();
    } else {
      closeToolMenu();
    }
  };

  return (
    <button
      aria-disabled={ariaDisabled}
      className={`${textButtonClass} ${mediumButtonClass} ${focusedButtonClass}`}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={initiativeOnClick}
      tabIndex={tabIndex}
      aria-haspopup="true"
      aria-controls={toolMenuId}
      aria-expanded={toolMenuExpanded}
    >
      <InitiativeIcon />
      Initiative
    </button>
  );
}
