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
    return (
      <div className="creature-toolbar--form">
        <form onKeyDown={this.formHandler}>
          <input className="creature-toolbar--input" type={type} placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleChange}/>
        </form>
      </div>
    );
  }
}

CreatureToolbarInput.defaultProps = {
  integer: false
};

export default CreatureToolbarInput;