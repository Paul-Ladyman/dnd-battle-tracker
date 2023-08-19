import React from 'react';

function isInputDisabled(disabled, leftEnabled, rightEnabled) {
  if (disabled) return true;

  if (leftEnabled !== undefined && rightEnabled !== undefined) {
    return leftEnabled === false && rightEnabled === false;
  }

  return leftEnabled === false || rightEnabled === false;
}

function Input({
  integer,
  spinner,
  error,
  required,
  inputRef,
  leftControls,
  rightControls,
  customClasses,
  ariaLabel,
  ariaAutoComplete,
  ariaExpanded,
  ariaControls,
  ariaActiveDescendant,
  role,
  label,
  name,
  min,
  max,
  value,
  submitHandler,
  handleChange,
  formHandler,
  inputId,
  onClick,
  onBlur,
  spellCheck = true,
  disabled,
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
  const inputDisabled = isInputDisabled(disabled, leftEnabled, rightEnabled);

  const buttonClass = 'input--submit';
  const leftButtonClasses = leftDisabled ? `${buttonClass} ${buttonClass}__left ${buttonClass}__disabled` : `${buttonClass} ${buttonClass}__left`;
  const rightButtonClasses = rightDisabled ? `${buttonClass} ${buttonClass}__right ${buttonClass}__disabled` : `${buttonClass} ${buttonClass}__right`;

  const inputClassDisabled = inputDisabled ? 'input__disabled' : '';
  const inputSpinnerClass = spinner ? '' : 'input__no-spinner';
  const inputClassRightModifier = RightSubmitIcon || RightControl ? 'input__button-right' : '';
  const inputClassLeftModifier = LeftSubmitIcon ? 'input__button-left' : '';
  const inputClassLeftDisabled = leftDisabled ? 'input__button-left-disabled' : '';
  const inputClassRightDisabled = rightDisabled ? 'input__button-right-disabled' : '';
  const inputClasses = `input ${inputClassDisabled} ${inputClassLeftModifier} ${inputClassLeftDisabled} ${inputClassRightModifier} ${inputClassRightDisabled} ${inputSpinnerClass}`;

  const leftSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    submitHandler(true);
  };

  const rightSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    submitHandler(false);
  };

  return (
    <div className={`input--form ${numberModifier} ${customClasses}`}>
      <label aria-label={ariaLabel} htmlFor={inputId}>
        <div className="form--label">
          {label}
          {error}
        </div>
      </label>
      <div className={`input-wrapper ${inputErrorClass}`}>
        {LeftSubmitIcon && (
          <button
            aria-disabled={leftDisabled}
            type="button"
            className={leftButtonClasses}
            title={leftTitle}
            aria-label={leftTitle}
            onClick={leftSubmit}
          >
              {LeftSubmitIcon}
          </button>
        )}
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
          disabled={inputDisabled}
          onClick={onClick}
          onBlur={onBlur}
          aria-autocomplete={ariaAutoComplete}
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
          aria-activedescendant={ariaActiveDescendant}
          role={role}
          autoComplete="off"
          spellCheck={spellCheck}
          aria-disabled={inputDisabled}
        />
        {RightControl && <div className={`button ${rightButtonClasses}`} style={{ display: 'flex', justifyContent: 'center' }}>{RightControl}</div>}
        {!RightControl && RightSubmitIcon
          && (
            <button
              aria-disabled={rightDisabled}
              type="button"
              className={rightButtonClasses}
              title={rightTitle}
              aria-label={rightTitle}
              onClick={rightSubmit}
            >
              {RightSubmitIcon}
            </button>
          )}
      </div>
    </div>
  );
}

Input.defaultProps = {
  leftControls: {},
  rightControls: {},
};

export default Input;
