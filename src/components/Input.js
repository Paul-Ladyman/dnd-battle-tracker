import React from 'react';

function Input({
  integer,
  enabled,
  error,
  required,
  inputRef,
  LeftSubmitIcon,
  RightSubmitIcon,
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
  const inputWrapperClasses = `input-wrapper ${disabledModifier}`;
  const buttonClasses = enabled ? 'input--submit' : 'input--submit input--submit__disabled';
  const inputErrorClass = error ? 'input__error' : '';

  const inputClassRightModifier = RightSubmitIcon || RightControl ? 'input__button-right' : '';
  const inputClassLeftModifier = LeftSubmitIcon ? 'input__button-left' : '';
  const inputClasses = `input ${inputClassLeftModifier} ${inputClassRightModifier}`;

  return (
    <div className={`input--form ${numberModifier} ${customClasses}`}>
      <label aria-label={ariaLabel} htmlFor={inputId}>
        <div className="form--label">
          {label}
          {error}
        </div>
        <div className={`${inputWrapperClasses} ${inputErrorClass}`}>
          {LeftSubmitIcon && <button disabled={!enabled} type="button" className={buttonClasses} title={label} onClick={submitHandler}>{LeftSubmitIcon}</button>}
          <input
            id={inputId}
            disabled={!enabled}
            required={required}
            className={inputClasses}
            ref={inputRef}
            name={name}
            type={type}
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            onKeyDown={formHandler}
          />
          {RightControl && <div className={`button ${buttonClasses}`} style={{ display: 'flex', justifyContent: 'center' }}>{RightControl}</div>}
          {!RightControl && RightSubmitIcon
            && <button disabled={!enabled} type="button" className={buttonClasses} title={label} onClick={submitHandler}>{RightSubmitIcon}</button>}
        </div>
      </label>
    </div>
  );
}

export default Input;
