import React, { Component } from 'react';
import isHotkey from 'is-hotkey';
import { hotkeys } from '../hotkeys/hotkeys';
import AddCreatureIcon from './icons/AddCreatureIcon';
import MonsterSearcher from './MonsterSearcher';
import Input from './Input';

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
    const { playerSession } = this.props;

    window.addEventListener('keydown', (e) => {
      if (!playerSession && isHotkey(hotkeys.createCreature, e)) {
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

    return (
      <form  className="create-creature-form" onKeyDown={this.formHandler}>
        <Input
          customClasses="create-creature-form--item__text"
          enabled
          required
          error={nameError && <span className="form--label__error"> *</span>}
          inputRef={this.nameInput}
          value={name}
          ariaLabel="create creature form. Name (required)"
          label="Creature Name"
          name="name"
          handleChange={this.handleChange}
          RightControl={<MonsterSearcher asButton={false} search={name}/>}
        />
        <Input
          customClasses="create-creature-form--item__number create-creature-form--item__tall"
          enabled
          error={initiativeError}
          integer
          value={initiative}
          ariaLabel="create creature form. Initiative (optional)"
          label="Initiative (optional)"
          name="initiative"
          handleChange={this.handleChange}
        />
        <Input
          customClasses="create-creature-form--item__number"
          enabled
          integer
          error={healthError && <span className="form--label__error"> > 0</span>}
          value={healthPoints}
          ariaLabel="create creature form. Health points (optional)"
          label="HP (optional)"
          min="1"
          name="healthPoints"
          handleChange={this.handleChange}
        />
        <div className="create-creature-form--multiplier-wrapper">
          <span className="create-creature-form--multiplier-symbol">x</span>
          <Input
            customClasses="create-creature-form--item__multiplier"
            enabled
            integer
            required
            min="1"
            max="50"
            error={multiplierError && <span className="form--label__error"> * 1 - 50</span>}
            value={multiplier}
            ariaLabel="create creature form. Multiplier (required)"
            label="Multiply"
            name="multiplier"
            handleChange={this.handleChange}
          />
        </div>
        <div className="create-creature-form--item__submit">
          <button type="button" className="create-creature-form--submit" title="Add creature" onClick={this.createCreature}><AddCreatureIcon /></button>
        </div>
      </form>
    ); 
  }
}

export default CreateCreatureForm;