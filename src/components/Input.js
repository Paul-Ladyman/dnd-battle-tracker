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
    formHandler
}) {
  const type = integer ? "number" : "text";
  const numberModifier = integer ? 'creature-toolbar--form__number' : '';
  const disabledModifier = enabled ? '' : 'creature-toolbar--input-wrapper__disabled';
  const inputWrapperClass = 'creature-toolbar--input-wrapper';
  const noButtonModifier = `creature-toolbar--input-wrapper__no-button`;
  const inputWrapperClasses = SubmitIcon || RightControl ?
    `${inputWrapperClass} ${disabledModifier}` :
    `${inputWrapperClass} ${noButtonModifier} ${disabledModifier}`;
  const buttonClasses = enabled ? 'creature-toolbar--submit' : 'creature-toolbar--submit creature-toolbar--submit__disabled';

  return (
    <div className={`creature-toolbar--form ${numberModifier} ${customClasses}`}>
      <label aria-label={ariaLabel}>
        <div className="form--label">
          {label}
          {error}
        </div>
        <div className={inputWrapperClasses}>
          <div onKeyDown={formHandler} id="input">
            <input disabled={!enabled} required={required} className='creature-toolbar--input' ref={inputRef} name={name} type={type} min={min} max={max} value={value} onChange={handleChange}/>
          </div>
          {RightControl && <div className={`button ${buttonClasses}`} style={{display: 'flex', justifyContent: 'center'}}>{RightControl}</div>}
          {!RightControl && SubmitIcon &&
            <button disabled={!enabled} type="button" className={buttonClasses} title={label} onClick={submitHandler}>{SubmitIcon}</button>
          }
        </div>
      </label>
    </div>
  );
}

export default Input;