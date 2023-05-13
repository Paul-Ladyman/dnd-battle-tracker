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
  return (
    <button
      title="HP"
      className={buttonClass}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      <HpIcon />
    </button>
  );
}
