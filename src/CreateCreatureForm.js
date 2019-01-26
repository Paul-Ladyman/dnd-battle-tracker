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
      <form onKeyDown={this.formHandler}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" value={name} onChange={this.handleChange} ref={this.nameInput}/>
        <label htmlFor="initiative">Initiative</label>
        <input type="text" name="initiative" value={initiative} onChange={this.handleChange}/>
        <label htmlFor="healthPoints">HP</label>
        <input type="text" name="healthPoints" value={healthPoints} onChange={this.handleChange}/>
      </form>
    ); 
  }
}

export default CreateCreatureForm;