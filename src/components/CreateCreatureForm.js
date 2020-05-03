import React, { Component } from 'react';
import isHotkey from 'is-hotkey';
import { hotkeys } from '../hotkeys/hotkeys';
import AddCreatureIcon from './icons/AddCreatureIcon';

class CreateCreatureForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      name: '',
      initiative: '',
      healthPoints: '',
      multiplier: 1
    };

    this.state = this.initialState;

    this.nameInput = React.createRef();

    this.resetForm = this.resetForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.createCreature = this.createCreature.bind(this);
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

  createCreature() {
    const state = this.state;

    const healthPoints = state.healthPoints === '' ?
      undefined :
      parseInt(state.healthPoints);

    const multiplier = parseInt(state.multiplier);

    const initiative = state.initiative === '' ?
      undefined :  
      parseInt(state.initiative);

    const creature = {...state, healthPoints, initiative, multiplier};

    const createSuccess = this.props.createCreature(creature);
    if (createSuccess) {
      this.resetForm();
    }
  }

  formHandler(event) {
    if (event.keyCode === 13) {
      this.createCreature();
    }
  }

  render() {
    const { name, initiative, healthPoints, multiplier } = this.state;
    const { nameError, initiativeError, healthError, multiplierError } = this.props.createCreatureErrors;
    const inputClass = 'form--input';
    const inputErrorClass = 'create-creature-form--input__error';
    const nameClass = nameError ? `${inputClass} ${inputErrorClass}` : inputClass;
    const initiativeClass = initiativeError ? `${inputClass} ${inputErrorClass}` : inputClass;
    const healthClass = healthError ? `${inputClass} ${inputErrorClass}` : inputClass;
    const multiplierClass = multiplierError ? `${inputClass} ${inputErrorClass}` : inputClass;

    return (
      <form  className="create-creature-form" onKeyDown={this.formHandler}>
        <div className="create-creature-form--item create-creature-form--item__text">
          <label aria-label="create creature form. Name (required)" htmlFor="name" className="form--label">
            Creature Name
            {nameError && <span class="form--label__error"> *</span>}
          </label>
          <div className="create-creature-form--input-container">
            <input className={nameClass} type="text" required id="name" name="name" value={name} onChange={this.handleChange} ref={this.nameInput}/>
          </div>
        </div>
        <div className="create-creature-form--item create-creature-form--item__number create-creature-form--item__tall">
          <label aria-label="create creature form. Initiative (optional)" htmlFor="initiative" className="form--label">
            Initiative (optional)
            {initiativeError && <span className="form--label__error"> *</span>}
          </label>
          <div className="create-creature-form--input-container">
            <input className={initiativeClass} type="number" id="initiative" name="initiative" value={initiative} onChange={this.handleChange}/>
          </div>
        </div>
        <div className="create-creature-form--item create-creature-form--item__number">
          <label aria-label="create creature form. Health points (optional)" htmlFor="healthPoints" className="form--label">
            HP (optional)
            {healthError && <span class="form--label__error"> > 0</span>}
          </label>
          <div className="create-creature-form--input-container">
            <input className={healthClass} type="number" min="1" id="healthPoints" name="healthPoints" value={healthPoints} onChange={this.handleChange}/>
          </div>
        </div>
        <div className="create-creature-form--item create-creature-form--item__multiplier">
          <label aria-label="create creature form. Multiplier (required)" htmlFor="multiplier" className="form--label">
            Multiply
            {multiplierError && <span class="form--label__error"> * 1 - 50</span>}
          </label>
          <div className="create-creature-form--input-container">
            <div className="create-creature-form--multiplier">x</div>
            <input className={`${multiplierClass} create-creature-form--input__small-number`} type="number" min="1" max="50" id="multiplier" name="multiplier" value={multiplier} onChange={this.handleChange}/>
          </div>
        </div>
        <div className="create-creature-form--item create-creature-form--item__submit">
          <button type="button" className="create-creature-form--submit" title="Add creature" onClick={this.createCreature}><AddCreatureIcon /></button>
        </div>
      </form>
    ); 
  }
}

export default CreateCreatureForm;