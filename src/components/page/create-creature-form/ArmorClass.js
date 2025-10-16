import React from 'react';
import Input from '../../form/Input';

export default function ArmorClass({
  ac,
  handleChange,
  error,
}) {
  return (
    <Input
      ariaLabel="create creature form. AC (optional)"
      label="AC (optional)"
      customClasses="create-creature-form--item__number"
      error={error}
      name="armorClass"
      integer
      min="1"
      value={ac}
      handleChange={handleChange}
      inputId="create-creature-form-ac"
    />
  );
}
