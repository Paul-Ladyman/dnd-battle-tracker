import React from 'react';
import Input from '../../form/Input';

export default function Multiply({
  multiplier,
  handleChange,
  formHandler,
  error,
}) {
  return (
    <div className="create-creature-form--multiplier-wrapper">
      <span className="create-creature-form--multiplier-symbol">x</span>
      <Input
        customClasses={`create-creature-form--item__multiplier ${error && 'create-creature-form--item__tall'}`}
        integer
        required
        min="1"
        max="50"
        error={error && <span className="form--label__error"> &gt;0, &lt;51</span>}
        value={multiplier}
        ariaLabel="create creature form. Multiplier (required)"
        label="Multiply"
        name="multiplier"
        handleChange={handleChange}
        formHandler={formHandler}
        inputId="create-creature-form-multiplier"
      />
    </div>
  );
}
