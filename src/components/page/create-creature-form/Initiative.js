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
  inputRef,
}) {
  return (
    <Rollable
      Component={Input}
      value={initiative}
      customClasses="create-creature-form--item__number"
      error={error}
      ariaLabel="create creature form. Initiative (optional)"
      label="Initiative (optional)"
      name="initiative"
      handleChange={handleChange}
      submitHandler={toggleRollEachInitiative}
      rightControls={{
        rightTitle: rollEachInitiative ? 'Roll initiative as group' : 'Roll initiative per creature',
        RightSubmitIcon: rollEachInitiative ? <RollEachIcon /> : <RollGroupIcon />,
      }}
      inputId="create-creature-form-initiative"
      ref={inputRef}
    />
  );
}
