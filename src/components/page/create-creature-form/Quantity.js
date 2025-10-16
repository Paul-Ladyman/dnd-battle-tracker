import React from 'react';
import Input from '../../form/Input';
import Rollable from '../../form/Rollable';

export default function Quantity({
  quantity,
  handleChange,
  error,
  inputRef,
}) {
  return (
    <div className="create-creature-form--quantity-wrapper">
      <span className="create-creature-form--quantity-symbol">x</span>
      <Rollable
        Component={Input}
        ref={inputRef}
        customClasses="create-creature-form--item__quantity"
        required
        min="1"
        max="50"
        error={error}
        value={quantity}
        ariaLabel="create creature form. Quantity (required)"
        label="Quantity"
        name="quantity"
        handleChange={handleChange}
        inputId="create-creature-form-quantity"
      />
    </div>
  );
}
