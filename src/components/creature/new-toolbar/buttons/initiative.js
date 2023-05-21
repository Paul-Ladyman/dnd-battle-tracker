import React from 'react';
import InitiativeIcon from '../../../icons/InitiativeIcon';

export default function InitiativeButton({
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
}) {
  const toolbarClass = 'new-creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  return (
    <button
      className={textButtonClass}
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
