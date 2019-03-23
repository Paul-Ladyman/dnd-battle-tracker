import React, { Component } from 'react';

class CreatureToolbarInput extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.formHandler = this.formHandler.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  resetForm() {
    this.setState({value: ''});
  }

  formHandler(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      const value = this.state.value;
      if (value) {
        this.resetForm();
        const submittedValue = this.props.integer ? parseInt(value) : value;
        this.props.onSubmit(submittedValue);
      }
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    const type = this.props.integer ? "number" : "text";
    const numberModifier = this.props.integer ? 'creature-toolbar--form__number' : '';
    const disabledModifier = this.props.enabled ? '' : 'creature-toolbar--input__disabled';
    const classes = `creature-toolbar--input ${disabledModifier}`;
    return (
      <form className={`creature-toolbar--form ${numberModifier} ${this.props.customClasses}`} onKeyDown={this.formHandler}>
        <input disabled={!this.props.enabled} className={classes} type={type} placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleChange}/>
      </form>
    );
  }
}

CreatureToolbarInput.defaultProps = {
  integer: false,
  enabled: true,
  customClasses: ''
};

export default CreatureToolbarInput;