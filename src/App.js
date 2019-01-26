import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CreateCreatureForm from './CreateCreatureForm';
import Creatures from './Creatures';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      creatures: []
    };

    this.createCreature = this.createCreature.bind(this);
  }

  createCreature(creature) {
    const newCreature = {
      ...creature,
      initiative: parseInt(creature.initiative),
      healthPoints: parseInt(creature.healthPoints)
    };
    const creatures = [...this.state.creatures, newCreature];
    this.setState({...this.state, creatures});
  }

  render() {
    return (
      <div className="App">
        <Creatures creatures={this.state.creatures} />
        <CreateCreatureForm createCreature={this.createCreature} />
      </div>
    );
  }
}

export default App;
