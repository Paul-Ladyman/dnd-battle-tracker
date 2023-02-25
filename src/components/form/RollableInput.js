import React, { useImperativeHandle } from 'react';
import Input from './Input';
import roll from '../../domain/dice';

function RollableInput({
  customClasses,
  error,
  value,
  ariaLabel,
  label,
  name,
  handleChange,
  submitHandler,
  rightControls,
  formHandler,
  inputId,
}, forwardedRef) {
  useImperativeHandle(
    forwardedRef,
    () => ({
      roll: () => roll(value),
    }),
    [value],
  );

  return (
    <Input
      customClasses={`input--number ${customClasses}`}
      error={error}
      value={value}
      ariaLabel={ariaLabel}
      label={label}
      name={name}
      handleChange={handleChange}
      submitHandler={submitHandler}
      rightControls={rightControls}
      formHandler={formHandler}
      inputId={inputId}
      spellCheck={false}
    />
  );
}

export default React.forwardRef(RollableInput);
