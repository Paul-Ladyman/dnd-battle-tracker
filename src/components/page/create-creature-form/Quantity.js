import React from 'react';
import Input from '../../form/Input';

export default function Quantity({
  quantity,
  handleChange,
  formHandler,
  error,
}) {
  return (
    <div className="create-creature-form--quantity-wrapper">
      <span className="create-creature-form--quantity-symbol">x</span>
      <Input
        customClasses={`create-creature-form--item__quantity ${error && 'create-creature-form--item__tall'}`}
        integer
        required
        min="1"
        max="50"
        error={error && <span className="form--label__error"> &gt;0, &lt;51</span>}
        value={quantity}
        ariaLabel="create creature form. Quantity (required)"
        label="Quantity"
        name="quantity"
        handleChange={handleChange}
        formHandler={formHandler}
        inputId="create-creature-form-quantity"
      />
    </div>
  );
}
