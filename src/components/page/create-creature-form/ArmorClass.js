import React from 'react';
import Input from '../../form/Input';

export default function ArmorClass({
  ac,
  handleChange,
  formHandler,
  error,
}) {
  return (
    <Input
      ariaLabel="create creature form. AC (optional)"
      label="AC (optional)"
      customClasses={`create-creature-form--item__number ${error && 'create-creature-form--item__tall'}`}
      error={error && <span className="form--label__error"> number &gt;0</span>}
      name="armorClass"
      integer
      min="1"
      value={ac}
      handleChange={handleChange}
      formHandler={formHandler}
      inputId="create-creature-form-ac"
    />
  );
}
