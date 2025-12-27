import React from 'react';
import ConditionsIcon from '../../../icons/ConditionsIcon';
import ConditionsTool from '../tools/ConditionsTool';

export function ConditionsToolMenu({
  creature,
  creatureManagement,
  toolMenuId,
}) {
  const { id, conditions: creatureConditions } = creature;
  const { addNoteToCreature, removeNoteFromCreature } = creatureManagement;
  return (
    <div className="creature-toolbar--entrance">
      <ConditionsTool
        id={id}
        creatureConditions={creatureConditions}
        addNoteToCreature={addNoteToCreature}
        removeNoteFromCreature={removeNoteFromCreature}
        toolMenuId={toolMenuId}
      />
    </div>
  );
}

export function ConditionsButton({
  creature,
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
  focused,
  toolMenuId,
  toolMenuExpanded,
}) {
  const { selected } = creature;
  const ariaDisabled = selected ? 'true' : 'false';
  const toolbarClass = 'creature-toolbar';
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
      onClick={() => !selected && onClick()}
      tabIndex={tabIndex}
      aria-haspopup="true"
      aria-controls={toolMenuId}
      aria-expanded={toolMenuExpanded}
      aria-disabled={ariaDisabled}
      id={`${toolMenuId}-conditions`}
    >
      <ConditionsIcon />
      Conditions
    </button>
  );
}
