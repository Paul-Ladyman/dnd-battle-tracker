import React from 'react';

function Input({
  integer,
  enabled,
  error,
  required,
  inputRef,
  SubmitIcon,
  RightControl,
  customClasses,
  ariaLabel,
  label,
  name,
  min,
  max,
  value,
  submitHandler,
  handleChange,
  formHandler,
  inputId,
}) {
  const type = integer ? 'number' : 'text';
  const numberModifier = integer ? 'input--number' : '';
  const disabledModifier = enabled ? '' : 'input-wrapper__disabled';
  const inputWrapperClass = 'input-wrapper';
  const noButtonModifier = 'input-wrapper__no-button';
  const inputWrapperClasses = SubmitIcon || RightControl
    ? `${inputWrapperClass} ${disabledModifier}`
    : `${inputWrapperClass} ${noButtonModifier} ${disabledModifier}`;
  const buttonClasses = enabled ? 'input--submit' : 'input--submit input--submit__disabled';
  const inputErrorClass = error ? 'input__error' : '';

  return (
    <div className={`input--form ${numberModifier} ${customClasses}`}>
      <label aria-label={ariaLabel} htmlFor={inputId}>
        <div className="form--label">
          {label}
          {error}
        </div>
        <div className={`${inputWrapperClasses} ${inputErrorClass}`}>
          <div id="input">
            <input id={inputId} disabled={!enabled} required={required} className="input" ref={inputRef} name={name} type={type} min={min} max={max} value={value} onChange={handleChange} onKeyDown={formHandler} />
          </div>
          {RightControl && <div className={`button ${buttonClasses}`} style={{ display: 'flex', justifyContent: 'center' }}>{RightControl}</div>}
          {!RightControl && SubmitIcon
            && <button disabled={!enabled} type="button" className={buttonClasses} title={label} onClick={submitHandler}>{SubmitIcon}</button>}
        </div>
      </label>
    </div>
  );
}

export default Input;
