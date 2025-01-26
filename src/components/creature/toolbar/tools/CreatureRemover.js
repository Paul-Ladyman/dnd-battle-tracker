import React, { useState, useRef } from 'react';
import RemoveIcon from '../../../icons/RemoveIcon';
import AlertDialog from '../../../widgets/AlertDialog';

export default function CreatureRemover({
  creature,
  removeCreature,
  disabled,
}) {
  const [removing, setRemoving] = useState(false);
  const buttonRef = useRef(null);
  const { name, id } = creature;
  const ariaDisabled = disabled ? 'true' : 'false';
  const onClick = () => {
    if (!disabled) setRemoving(true);
  };
  const onConfirm = () => {
    if (!disabled) removeCreature(id);
  };
  const onCancel = () => {
    setRemoving(false);
    buttonRef.current.focus();
  };
  const toolbarClass = 'creature-toolbar';
  const buttonClass = `${toolbarClass}-button`;
  const textButtonClass = `${buttonClass} ${buttonClass}__text`;
  const confirmationMessage = `Are you sure you want to remove ${name}?`;

  return (
    <>
      <button
        aria-label={`remove ${name}`}
        aria-disabled={ariaDisabled}
        className={textButtonClass}
        onClick={onClick}
        type="button"
        ref={buttonRef}
      >
        <RemoveIcon />
        Remove
      </button>
      <AlertDialog
        show={removing}
        message={confirmationMessage}
        onYes={onConfirm}
        onNo={onCancel}
      />
    </>
  );
}
