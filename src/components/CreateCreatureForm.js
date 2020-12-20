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
      multiplier: 1,
      submitted: false,
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

  componentDidUpdate() {
    const { createCreatureErrors } = this.props;
    const errors = Object.keys(createCreatureErrors).length > 0;

    const { submitted } = this.state;
    if (submitted && !errors) {
      this.resetForm();
    }
  }

  handleChange(event) {
    const newState = { ...this.state };
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  resetForm() {
    this.setState(this.initialState);
    this.nameInput.current.focus();
  }

  createCreature() {
    const { state } = this;

    const healthPoints = state.healthPoints === ''
      ? undefined
      : parseInt(state.healthPoints, 10);

    const multiplier = parseInt(state.multiplier, 10);

    const initiative = state.initiative === ''
      ? undefined
      : parseInt(state.initiative, 10);

    const creature = {
      ...state, healthPoints, initiative, multiplier,
    };

    const { createCreature } = this.props;
    createCreature(creature);
    this.setState((prevState) => ({ ...prevState, submitted: true }));
  }

  formHandler(event) {
    if (event.keyCode === 13) {
      this.createCreature();
    }
  }

  render() {
    const {
      name, initiative, healthPoints, multiplier,
    } = this.state;
    const { createCreatureErrors } = this.props;
    const {
      nameError, initiativeError, healthError, multiplierError,
    } = createCreatureErrors;

    return (
      <form className="create-creature-form">
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
          RightControl={<MonsterSearcher asButton={false} search={name} />}
          formHandler={this.formHandler}
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
          formHandler={this.formHandler}
        />
        <Input
          customClasses="create-creature-form--item__number"
          enabled
          integer
          error={healthError && <span className="form--label__error"> &gt; 0</span>}
          value={healthPoints}
          ariaLabel="create creature form. Health points (optional)"
          label="HP (optional)"
          min="1"
          name="healthPoints"
          handleChange={this.handleChange}
          formHandler={this.formHandler}
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
            formHandler={this.formHandler}
          />
        </div>
        <div className="create-creature-form--item__submit">
          <button
            type="button"
            className="create-creature-form--submit"
            title="Add creature"
            aria-label="Add creature"
            onClick={this.createCreature}
          >
            <AddCreatureIcon />
          </button>
        </div>
      </form>
    );
  }
}

export default CreateCreatureForm;
