/* eslint-disable react/jsx-props-no-spreading */
import React, { useImperativeHandle } from 'react';
import roll from '../../domain/dice';

function Rollable({
  value,
  Component,
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
      {...props}
    />
  );
}

export default React.forwardRef(Rollable);
