import React, { Component } from 'react';
import AddCreatureIcon from './icons/AddCreatureIcon';

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
    const classes = `form--input creature-toolbar--input ${disabledModifier}`;
    return (
        <div className={`creature-toolbar--form ${numberModifier} ${this.props.customClasses}`}>
          <label aria-label={this.props.ariaLabel}>
            <div className="form--label">{this.props.label}</div>
            <form className="creature-toolbar--input-wrapper" onKeyDown={this.formHandler}>
              <input disabled={!this.props.enabled} className={classes} name={this.props.name} type={type} value={this.state.value} onChange={this.handleChange}/>
              <button type="button" className="creature-toolbar--submit" title={this.props.label}><AddCreatureIcon /></button>
            </form>
          </label>
        </div>
    );
  }
}

CreatureToolbarInput.defaultProps = {
  integer: false,
  enabled: true,
  customClasses: ''
};

export default CreatureToolbarInput;