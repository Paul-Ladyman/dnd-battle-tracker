import React, { useEffect } from 'react';
import Input from './Input';
import roll from '../../domain/dice';

export default function RollableInput({
  customClasses,
  error,
  value,
  setRoll,
  ariaLabel,
  label,
  name,
  handleChange,
  submitHandler,
  rightControls,
  formHandler,
  inputId,
}) {
  useEffect(() => {
    if (setRoll) {
      setRoll(roll(value));
    }
  }, [value]);

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
