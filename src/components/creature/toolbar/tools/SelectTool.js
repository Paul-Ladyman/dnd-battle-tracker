import React, { useEffect } from 'react';
import CheckedIcon from '../../../icons/CheckedIcon';
import UncheckedIcon from '../../../icons/UncheckedIcon';

export default function SelectTool({
  creature,
  creatureManagement,
  onFocus,
  onClick,
  tabIndex,
  buttonRef,
  toolMenuId,
  focused,
}) {
  const { selected, id } = creature;
  const { toggleSelect } = creatureManagement;
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const iconButtonClass = `${buttonClass} ${buttonClass}__icon`;
  const mediumButtonClass = `${buttonClass}__medium`;
  const focusedButtonClass = focused ? `${buttonClass}__focused` : '';

  const onClickSelect = () => {
    toggleSelect(id);
    onClick();
  };

  useEffect(() => {
    if (selected) buttonRef?.current?.focus();
  }, [selected]);

  return (
    <button
      className={`${textButtonClass} ${iconButtonClass} ${mediumButtonClass} ${focusedButtonClass}`}
      type="button"
      ref={buttonRef}
      onFocus={onFocus}
      onClick={onClickSelect}
      tabIndex={tabIndex}
      id={`${toolMenuId}-conditions`}
      aria-pressed={selected ? 'true' : 'false'}
    >
      {selected ? <CheckedIcon /> : <UncheckedIcon />}
      <div className={`${buttonClass}--text`}>{selected ? 'Unselect' : 'Select'}</div>
    </button>
  );
}
