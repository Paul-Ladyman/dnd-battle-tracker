/* eslint-disable react/jsx-props-no-spreading */
import React, { useImperativeHandle } from 'react';
import roll, { validateDiceNotation } from '../../domain/dice';

function Rollable({
  value,
  Component,
  customClasses,
  min,
  max,
  required,
  ...props
}, forwardedRef) {
  useImperativeHandle(
    forwardedRef,
    () => ({
      roll: () => roll(value),
    }),
    [value],
  );

  const validate = (valueToValidate) => {
    if (valueToValidate === '' && !required) return true;
    const intValue = parseInt(valueToValidate, 10);
    const minValid = min ? intValue >= min : true;
    const maxValid = max ? intValue <= max : true;
    return minValid && maxValid && validateDiceNotation(valueToValidate);
  };

  return (
    <Component
      value={value}
      customClasses={`input--number ${customClasses}`}
      spellCheck={false}
      integer={false}
      required={required}
      validate={validate}
      {...props}
    />
  );
}

export default React.forwardRef(Rollable);
