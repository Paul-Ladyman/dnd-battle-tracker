import React from 'react';

function Input({
  integer,
  error,
  required,
  inputRef,
  leftControls,
  rightControls,
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
  const { leftEnabled, LeftSubmitIcon, leftTitle } = leftControls;
  const { rightEnabled, RightSubmitIcon, RightControl, rightTitle } = rightControls;

  const type = integer ? 'number' : 'text';
  const numberModifier = integer ? 'input--number' : '';

  const inputErrorClass = error ? 'input__error' : '';

  const leftDisabled = leftEnabled === false;
  const rightDisabled = rightEnabled === false;

  const buttonClass = 'input--submit';
  const leftButtonClasses = leftDisabled ? `${buttonClass} input--submit__left ${buttonClass}__disabled` : buttonClass;
  const rightButtonClasses = rightDisabled ? `${buttonClass} input--submit__right ${buttonClass}__disabled` : buttonClass;

  const inputClassRightModifier = RightSubmitIcon || RightControl ? 'input__button-right' : '';
  const inputClassLeftModifier = LeftSubmitIcon ? 'input__button-left' : '';
  const inputClassLeftEnabled = leftDisabled ? 'input__button-left-disabled' : '';
  const inputClassRightEnabled = rightDisabled ? 'input__button-right-disabled' : '';
  const inputClasses = `input ${inputClassLeftModifier} ${inputClassLeftEnabled} ${inputClassRightModifier} ${inputClassRightEnabled}`;

  return (
    <div className={`input--form ${numberModifier} ${customClasses}`}>
      <label aria-label={ariaLabel} htmlFor={inputId}>
        <div className="form--label">
          {label}
          {error}
        </div>
        <div className={`input-wrapper ${inputErrorClass}`}>
          {LeftSubmitIcon && <button disabled={leftDisabled} type="button" className={leftButtonClasses} title={leftTitle} onClick={submitHandler}>{LeftSubmitIcon}</button>}
          <input
            id={inputId}
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
          {RightControl && <div className={`button ${rightButtonClasses}`} style={{ display: 'flex', justifyContent: 'center' }}>{RightControl}</div>}
          {!RightControl && RightSubmitIcon
            && <button disabled={rightDisabled} type="button" className={rightButtonClasses} title={rightTitle} onClick={submitHandler}>{RightSubmitIcon}</button>}
        </div>
      </label>
    </div>
  );
}

Input.defaultProps = {
  leftControls: {},
  rightControls: {},
};

export default Input;
