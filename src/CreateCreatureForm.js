import React, { Component } from 'react';

class CreateCreatureForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      initiative: '',
      healthPoints: '',
    };

    this.nameInput = React.createRef();

    this.resetForm = this.resetForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.formHandler = this.formHandler.bind(this);
  }

  resetForm() {
    this.setState({
      name: '',
      initiative: '',
      healthPoints: '',
    });

    this.nameInput.current.focus();
  }

  handleChange(event) {
    let newState = {...this.state};
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  formHandler(event) {
    if (event.keyCode === 13) {
      const creature = this.state;
      this.resetForm();
      this.props.createCreature(creature);
    }
  }

  render() {
    const {name, initiative, healthPoints} = this.state;
    return (
      <form className="create-creature-form centered__space-evenly" onKeyDown={this.formHandler}>
        <div className="create-creature-form--item">
          <input className="create-creature-form--input" type="text" name="name" value={name} onChange={this.handleChange} ref={this.nameInput}/>
          <label htmlFor="name">Name</label>
        </div>
        <div className="create-creature-form--item">
          <input className="create-creature-form--input__numeric" type="text" name="initiative" value={initiative} onChange={this.handleChange}/>
          <label htmlFor="initiative">Initiative</label>
        </div>
        <div className="create-creature-form--item">
          <input className="create-creature-form--input__numeric" type="text" name="healthPoints" value={healthPoints} onChange={this.handleChange}/>
          <label htmlFor="healthPoints">HP</label>
        </div>
      </form>
    ); 
  }
}

export default CreateCreatureForm;