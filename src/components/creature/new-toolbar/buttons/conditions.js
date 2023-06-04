import React from 'react';
import ConditionsIcon from '../../../icons/ConditionsIcon';
import ConditionsTool from '../../toolbar/ConditionsTool';

export function ConditionsToolMenu({
  creature,
  conditions,
  creatureManagement,
}) {
  const { name, id } = creature;
  const { addNoteToCreature } = creatureManagement;
  return (
    <div className="new-creature-toolbar--tool-menu">
      <ConditionsTool
        name={name}
        id={id}
        conditions={conditions}
        addNoteToCreature={addNoteToCreature}
      />
    </div>
  );
}

export function ConditionsButton({
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
  focused,
  toolMenuId,
  toolMenuExpanded,
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
      aria-haspopup="true"
      aria-controls={toolMenuId}
      aria-expanded={toolMenuExpanded}
    >
      <ConditionsIcon />
      Conditions
    </button>
  );
}
