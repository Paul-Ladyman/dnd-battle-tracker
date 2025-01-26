/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useEffect, useRef } from 'react';
import isHotkey from 'is-hotkey';
import ConfirmIcon from '../icons/ConfirmIcon';
import CrossIcon from '../icons/CrossIcon';

export default function AlertDialog({
  show,
  message,
  onNo,
  onYes,
}) {
  const noRef = useRef(null);
  const yesRef = useRef(null);
  const dialogRef = useRef(null);

  const focusTrapRight = () => {
    noRef.current.focus();
  };

  const focusTrapLeft = (e) => {
    if (e.relatedTarget?.id === 'alertdialog-no') yesRef.current.focus();
    else noRef.current.focus();
  };

  const onKeyUp = (e) => {
    const isTabOut = !dialogRef.current.contains(e.target) && isHotkey('shift+tab', e);
    if (isTabOut) yesRef.current.focus();
    const isEscape = e.keyCode === 27;
    if (isEscape) onNo();
  };

  const clickNo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onNo();
  };

  useEffect(() => {
    if (show) noRef.current.focus();
  }, [noRef, show]);

  useEffect(() => {
    if (show) {
      window.addEventListener('keyup', onKeyUp);
      return () => window.removeEventListener('keyup', onKeyUp);
    }

    return () => {};
  }, [show]);

  if (!show) return null;

  return (
    <>
      <div className="alert-dialog--background" />
      <div
        role="alertdialog"
        className="alert-dialog"
        aria-modal="true"
        aria-labelledby="dialog_label"
        aria-describedby="dialog_desc"
        id="alertdialog"
        ref={dialogRef}
      >
        <h2 id="dialog_label" className="alert-dialog--header">Confirmation</h2>
        <div id="dialog_desc">
          <p>
            {message}
          </p>
        </div>
        <div className="alert-dialog--buttons">
          <div tabIndex={0} onFocus={focusTrapLeft} />
          <button type="button" onClick={clickNo} className="alert-dialog--button" id="alertdialog-no" ref={noRef}>
            <CrossIcon rotate />
            No
          </button>
          <button type="button" onClick={onYes} className="alert-dialog--button" id="alertdialog-yes" ref={yesRef}>
            <ConfirmIcon />
            Yes
          </button>
          <div tabIndex={0} onFocus={focusTrapRight} />
        </div>
      </div>
    </>
  );
}
