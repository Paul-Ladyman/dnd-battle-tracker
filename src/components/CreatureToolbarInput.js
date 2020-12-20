import React, { Component } from 'react';
import Input from './Input';

class CreatureToolbarInput extends Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.formHandler = this.formHandler.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  resetForm() {
    this.setState({ value: '' });
  }

  submitHandler() {
    const { value } = this.state;
    if (value) {
      this.resetForm();
      const submittedValue = this.props.integer ? parseInt(value) : value;
      this.props.onSubmit(submittedValue);
    }
  }

  formHandler(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.submitHandler();
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <Input
        {...this.props}
        value={this.state.value}
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
