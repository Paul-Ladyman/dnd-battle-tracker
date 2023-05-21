import React from 'react';
import ConditionsIcon from '../../../icons/ConditionsIcon';

export default function ConditionsButton({
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
      <ConditionsIcon />
      Conditions
    </button>
  );
}
