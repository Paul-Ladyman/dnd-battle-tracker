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
  const {
    leftEnabled,
    LeftSubmitIcon,
    leftTitle,
  } = leftControls;
  const {
    rightEnabled,
    RightSubmitIcon,
    RightControl,
    rightTitle,
  } = rightControls;

  const type = integer ? 'number' : 'text';
  const numberModifier = integer ? 'input--number' : '';

  const inputErrorClass = error ? 'input__error' : '';

  const leftDisabled = leftEnabled === false;
  const rightDisabled = rightEnabled === false;

  const buttonClass = 'input--submit';
  const leftButtonClasses = leftDisabled ? `${buttonClass} ${buttonClass}__left ${buttonClass}__disabled` : `${buttonClass} ${buttonClass}__left`;
  const rightButtonClasses = rightDisabled ? `${buttonClass} ${buttonClass}__right ${buttonClass}__disabled` : `${buttonClass} ${buttonClass}__right`;

  const inputClassRightModifier = RightSubmitIcon || RightControl ? 'input__button-right' : '';
  const inputClassLeftModifier = LeftSubmitIcon ? 'input__button-left' : '';
  const inputClassLeftEnabled = leftDisabled ? 'input__button-left-disabled' : '';
  const inputClassRightEnabled = rightDisabled ? 'input__button-right-disabled' : '';
  const inputClasses = `input ${inputClassLeftModifier} ${inputClassLeftEnabled} ${inputClassRightModifier} ${inputClassRightEnabled}`;

  const leftSubmit = () => submitHandler(true);
  const rightSubmit = () => submitHandler(false);

  return (
    <div className={`input--form ${numberModifier} ${customClasses}`}>
      <label aria-label={ariaLabel} htmlFor={inputId}>
        <div className="form--label">
          {label}
          {error}
        </div>
        <div className={`input-wrapper ${inputErrorClass}`}>
          {LeftSubmitIcon && <button disabled={leftDisabled} type="button" className={leftButtonClasses} title={leftTitle} onClick={leftSubmit}>{LeftSubmitIcon}</button>}
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
            && <button disabled={rightDisabled} type="button" className={rightButtonClasses} title={rightTitle} onClick={rightSubmit}>{RightSubmitIcon}</button>}
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
