import React from 'react';
import HpIcon from '../../../icons/AddHpIcon';

export default function HpButton({
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
}) {
  const toolbarClass = 'new-creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const smallButtonClass = `${buttonClass}__small`;
  return (
    <button
      title="HP"
      className={`${textButtonClass} ${smallButtonClass}`}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      <HpIcon />
      HP
    </button>
  );
}
