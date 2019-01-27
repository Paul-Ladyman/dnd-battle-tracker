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
        this.props.onSubmit(parseInt(value));
      }
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div className="creature-toolbar--form">
        <form onKeyDown={this.formHandler}>
          <input className="creature-toolbar--input" type="text" placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleChange}/>
        </form>
      </div>
    );
  }
}

export default CreatureToolbarInput;