import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CreateCreatureForm from './CreateCreatureForm';
import Creatures from './Creatures';
import BattleToolbar from './BattleToolbar';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      creatures: [],
      creatureCount: 0
    };

    this.createCreature = this.createCreature.bind(this);
  }

  createCreature(creature) {
    const creatureCount = this.state.creatureCount + 1;
    
    const newCreature = {
      ...creature,
      initiative: parseInt(creature.initiative),
      healthPoints: parseInt(creature.healthPoints),
      id: creatureCount
    };
    
    const creatures = [...this.state.creatures, newCreature];

    this.setState({...this.state, creatures, creatureCount});
  }

  render() {
    return (
      <div className="App">
        <BattleToolbar combatants={this.state.creatureCount} />
        <Creatures creatures={this.state.creatures} />
        <CreateCreatureForm createCreature={this.createCreature} />
      </div>
    );
  }
}

export default App;
