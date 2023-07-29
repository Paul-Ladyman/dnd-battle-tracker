import React, { useState } from 'react';
import isHotkey from 'is-hotkey';
import Input from '../../../form/Input';

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
    const { leftHotkey, rightHotkey } = props;
    const isLeftHotkey = leftHotkey && isHotkey(leftHotkey, event);
    const isRightHotkey = rightHotkey && isHotkey(rightHotkey, event);
    const isEnter = isHotkey('enter', event);

    if (isLeftHotkey) {
      event.preventDefault();
      submitHandler(true);
    } else if (isRightHotkey || isEnter) {
      event.preventDefault();
      submitHandler(false);
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
