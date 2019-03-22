import React, { Component } from 'react';

class CreateCreatureForm extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      name: '',
      initiative: '',
      healthPoints: '',
      nameError: false,
      initiativeError: false
    };

    this.state = this.initialState;

    this.nameInput = React.createRef();

    this.resetForm = this.resetForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.formHandler = this.formHandler.bind(this);
  }

  componentDidMount() {
    this.nameInput.current.focus();
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

      if (state.name !== '' && state.initiative !== '') {
        const healthPoints = state.healthPoints === '' ?
          undefined :
          parseInt(state.healthPoints);

        const initiative = parseInt(state.initiative);

        const creature = {...state, healthPoints, initiative};

        this.resetForm();
        this.props.createCreature(creature);
      } else {
        const nameError = state.name === '';
        const initiativeError = state.initiative === '';
        this.setState({...this.state, nameError, initiativeError});
      }
    }
  }

  render() {
    const {name, initiative, healthPoints, nameError, initiativeError} = this.state;
    const inputClass = 'create-creature-form--input';
    const inputErrorClass = 'create-creature-form--input__error';
    const nameClass = nameError ? `${inputClass} ${inputErrorClass}` : inputClass;
    const initiativeClass = initiativeError ? `${inputClass} ${inputErrorClass}` : inputClass;
    return (
      <form className="create-creature-form" onKeyDown={this.formHandler}>
        <div className="create-creature-form--item">
          <input className={nameClass} type="text" name="name" placeholder="Name" value={name} onChange={this.handleChange} ref={this.nameInput}/>
        </div>
        <div className="create-creature-form--item">
          <input className={initiativeClass} type="number" name="initiative" placeholder="Initiative" value={initiative} onChange={this.handleChange}/>
        </div>
        <div className="create-creature-form--item">
          <input className={inputClass} type="number" name="healthPoints" placeholder="HP" value={healthPoints} onChange={this.handleChange}/>
        </div>
      </form>
    ); 
  }
}

export default CreateCreatureForm;