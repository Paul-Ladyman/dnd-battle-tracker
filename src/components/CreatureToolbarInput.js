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

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  formHandler(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.submitHandler();
    }
  }

  submitHandler() {
    const { value } = this.state;
    if (value) {
      const { integer, onSubmit } = this.props;
      this.resetForm();
      const submittedValue = integer ? parseInt(value, 10) : value;
      onSubmit(submittedValue);
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
