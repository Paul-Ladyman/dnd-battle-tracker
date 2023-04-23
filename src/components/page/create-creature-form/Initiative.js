import React from 'react';
import Input from '../../form/Input';
import RollGroupIcon from '../../icons/RollGroupIcon';
import RollEachIcon from '../../icons/RollEachIcon';
import Rollable from '../../form/Rollable';

export default function Initiative({
  initiative,
  error,
  handleChange,
  rollEachInitiative,
  toggleRollEachInitiative,
  formHandler,
  inputRef,
}) {
  return (
    <Rollable
      Component={Input}
      value={initiative}
      customClasses={`create-creature-form--item__number ${error && 'create-creature-form--item__tall'}`}
      error={error && <span className="form--label__error"> number, dice</span>}
      ariaLabel="create creature form. Initiative (optional)"
      label="Initiative (optional)"
      name="initiative"
      handleChange={handleChange}
      submitHandler={toggleRollEachInitiative}
      rightControls={{
        rightTitle: rollEachInitiative ? 'Roll initiative as group' : 'Roll initiative per creature',
        RightSubmitIcon: rollEachInitiative ? <RollEachIcon /> : <RollGroupIcon />,
      }}
      formHandler={formHandler}
      inputId="create-creature-form-initiative"
      ref={inputRef}
    />
  );
}
