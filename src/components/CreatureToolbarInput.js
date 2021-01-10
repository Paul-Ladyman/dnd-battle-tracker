import React, { useState } from 'react';
import isHotkey from 'is-hotkey';
import Input from './Input';
import { hotkeys } from '../hotkeys/hotkeys';

export default function CreatureToolbarInput(props) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const resetForm = () => {
    setValue('');
  };

  const submitHandler = (isLeftSubmit) => {
    if (value) {
      const { integer, leftSubmit, rightSubmit } = props;
      resetForm();
      const submittedValue = integer ? parseInt(value, 10) : value;
      const func = isLeftSubmit ? leftSubmit : rightSubmit;
      func(submittedValue);
    }
  };

  const formHandler = (event) => {
    if (isHotkey(hotkeys.healCreature, event)) {
      event.preventDefault();
      submitHandler(false);
    } else if (isHotkey(hotkeys.damageCreature, event)) {
      event.preventDefault();
      submitHandler(true);
    }
  };

  return (
    <Input
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      value={value}
      handleChange={handleChange}
      submitHandler={submitHandler}
      formHandler={formHandler}
    />
  );
}

CreatureToolbarInput.defaultProps = {
  integer: false,
  enabled: true,
  min: undefined,
  customClasses: '',
};
