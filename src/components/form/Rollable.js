/* eslint-disable react/jsx-props-no-spreading */
import React, { useImperativeHandle } from 'react';
import roll from '../../domain/dice';

function Rollable({
  value,
  Component,
  customClasses,
  ...props
}, forwardedRef) {
  useImperativeHandle(
    forwardedRef,
    () => ({
      roll: () => roll(value),
    }),
    [value],
  );

  return (
    <Component
      value={value}
      customClasses={`input--number ${customClasses}`}
      spellCheck={false}
      {...props}
    />
  );
}

export default React.forwardRef(Rollable);
