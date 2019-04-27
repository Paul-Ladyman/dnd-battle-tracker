import React, { Component } from 'react';
import isHotkey from 'is-hotkey';
import { hotkeys } from './hotkeys';

class CreateCreatureForm extends Component {
  static formErrors(name, initiative, healthPoints, multiplier) {
    const nameError = name === '';
    const initiativeError = initiative === '';
    const healthError = healthPoints <= 0;
    const multiplierError = multiplier <= 0 || multiplier > 50;

    if (nameError || initiativeError || healthError || multiplierError) {
      return {
        nameError,
        initiativeError,
        healthError,
        multiplierError
      };
    }

    return undefined;
  }

  constructor(props) {
    super(props);

    this.initialState = {
      name: '',
      initiative: '',
      healthPoints: '',
      multiplier: 1,
      nameError: false,
      initiativeError: false,
      healthError: false,
      multiplierError: false
    };

    this.state = this.initialState;

    this.nameInput = React.createRef();

    this.resetForm = this.resetForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.formHandler = this.formHandler.bind(this);
  }

  componentDidMount() {
    this.nameInput.current.focus();

    window.addEventListener('keydown', (e) => {
      if (isHotkey(hotkeys.createCreature, e)) {
        this.nameInput.current.focus();
      }
    });
  }

  resetForm() {
    this.setState(this.initialState);
    this.nameInput.current.focus();
  }

  handleChange(event) {
    let newState = {...this.state};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  formHandler(event) {
    if (event.keyCode === 13) {
      const state = this.state;

      const healthPoints = state.healthPoints === '' ?
        undefined :
        parseInt(state.healthPoints);

      const multiplier = state.multiplier === '' ?
        0 :
        parseInt(state.multiplier);

      const errors = CreateCreatureForm.formErrors(
        state.name,
        state.initiative,
        healthPoints,
        multiplier
      );

      if (errors) {
        return this.setState({...this.state, ...errors});
      }

      const initiative = parseInt(state.initiative);

      const creature = {...state, healthPoints, initiative, multiplier};

      this.resetForm();
      this.props.createCreature(creature);
    }
  }

  render() {
    const { name, initiative, healthPoints, multiplier, nameError, initiativeError, healthError, multiplierError } = this.state;
    const inputClass = 'create-creature-form--input';
    const inputErrorClass = 'create-creature-form--input__error';
    const nameClass = nameError ? `${inputClass} ${inputErrorClass}` : inputClass;
    const initiativeClass = initiativeError ? `${inputClass} ${inputErrorClass}` : inputClass;
    const healthClass = healthError ? `${inputClass} ${inputErrorClass}` : inputClass;
    const multiplierClass = multiplierError ? `${inputClass} ${inputErrorClass}` : inputClass;
    return (
      <form  className="create-creature-form" onKeyDown={this.formHandler}>
        <div className="create-creature-form--item create-creature-form--item__text">
          <label aria-label="create creature form. Name (required)" htmlFor="name" className="create-creature-form--label">Name <b>*</b></label>
          <input className={nameClass} type="text" required id="name" name="name" value={name} onChange={this.handleChange} ref={this.nameInput}/>
        </div>
        <div className="create-creature-form--item create-creature-form--item__number">
          <label aria-label="initiative (required)" htmlFor="initiative" className="create-creature-form--label">Initiative <b>*</b></label>
          <input className={initiativeClass} type="number" required id="initiative" name="initiative" value={initiative} onChange={this.handleChange}/>
        </div>
        <div className="create-creature-form--item create-creature-form--item__number">
          <label aria-label="health points" htmlFor="healthPoints" className="create-creature-form--label">HP</label>
          <input className={healthClass} type="number" min="1" id="healthPoints" name="healthPoints" value={healthPoints} onChange={this.handleChange}/>
        </div>
        <div className="create-creature-form--item create-creature-form--item__multiplier">
          <label aria-label="multiplier (require)" htmlFor="multiplier" className="create-creature-form--label">Multiplier <b>*</b></label>
          <div className="create-creature-form--multiplier-container">
            <div className="create-creature-form--multiplier">x</div>
            <input className={`${multiplierClass} ${inputClass}__small-number`} type="number" min="1" max="50" id="multiplier" name="multiplier" value={multiplier} onChange={this.handleChange}/>
          </div>
        </div>
      </form>
    ); 
  }
}

export default CreateCreatureForm;