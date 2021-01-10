import React, { Component } from 'react';
import isHotkey from 'is-hotkey';
import Input from './Input';
import { hotkeys } from '../hotkeys/hotkeys';

class CreatureToolbarInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.formHandler = this.formHandler.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  formHandler(event) {
    console.log('>>> hotkey', isHotkey(hotkeys.damageCreature, event));
    if (isHotkey(hotkeys.healCreature, event)) {
      event.preventDefault();
      this.submitHandler(false);
    } else if (isHotkey(hotkeys.damageCreature, event)) {
      event.preventDefault();
      this.submitHandler(true);
    }
  }

  submitHandler(isLeftSubmit) {
    const { value } = this.state;
    if (value) {
      const { integer, leftSubmit, rightSubmit } = this.props;
      this.resetForm();
      const submittedValue = integer ? parseInt(value, 10) : value;
      console.log('>>> left submit?', isLeftSubmit, leftSubmit);
      const func = isLeftSubmit ? leftSubmit : rightSubmit;
      func(submittedValue);
    }
  }

  resetForm() {
    this.setState({ value: '' });
  }

  render() {
    const { value } = this.state;
    return (
      <Input
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...this.props}
        value={value}
        handleChange={this.handleChange}
        submitHandler={this.submitHandler}
        formHandler={this.formHandler}
      />
    );
  }
}

CreatureToolbarInput.defaultProps = {
  integer: false,
  enabled: true,
  min: undefined,
  customClasses: '',
};

export default CreatureToolbarInput;
