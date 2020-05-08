import React, { Component } from 'react';
import Input from './Input';

class CreatureToolbarInput extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.formHandler = this.formHandler.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  resetForm() {
    this.setState({value: ''});
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
    this.setState({value: event.target.value});
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
    const type = this.props.integer ? "number" : "text";
    const numberModifier = this.props.integer ? 'creature-toolbar--form__number' : '';
    const disabledModifier = this.props.enabled ? '' : 'creature-toolbar--input-wrapper__disabled';
    const inputWrapperClass = 'creature-toolbar--input-wrapper';
    const noButtonModifier = `creature-toolbar--input-wrapper__no-button`;
    const inputWrapperClasses = this.props.submitIcon ?
      `${inputWrapperClass} ${disabledModifier}` :
      `${inputWrapperClass} ${noButtonModifier} ${disabledModifier}`;
    const buttonClasses = this.props.enabled ? 'creature-toolbar--submit' : 'creature-toolbar--submit creature-toolbar--submit__disabled';

    return (
      <div className={`creature-toolbar--form ${numberModifier} ${this.props.customClasses}`}>
        <label aria-label={this.props.ariaLabel}>
          <div className="form--label">{this.props.label}</div>
          <div className={inputWrapperClasses}>
            <div onKeyDown={this.formHandler}>
              <input disabled={!this.props.enabled} className='creature-toolbar--input' name={this.props.name} type={type} min={this.props.min} value={this.state.value} onChange={this.handleChange}/>
            </div>
            {this.props.submitIcon &&
              <button disabled={!this.props.enabled} type="button" className={buttonClasses} title={this.props.label} onClick={this.submitHandler}>{this.props.submitIcon()}</button>
            }
          </div>
        </label>
      </div>
    );
  }
}

CreatureToolbarInput.defaultProps = {
  integer: false,
  enabled: true,
  min: undefined,
  customClasses: ''
};

export default CreatureToolbarInput;