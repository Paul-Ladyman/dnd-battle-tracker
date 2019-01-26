import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CreateCreatureForm from './CreateCreatureForm';
import Creatures from './Creatures';
import BattleToolbar from './BattleToolbar';

class App extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      creatures: [],
      creatureCount: 0,
      activeCreature: 0,
      round: 1
    };

    this.state = this.initialState;

    this.createCreature = this.createCreature.bind(this);
    this.nextCreature = this.nextCreature.bind(this);
    this.resetBattle = this.resetBattle.bind(this);
  }

  resetBattle() {
    this.setState(this.initialState);
  }

  nextCreature() {
    let activeCreature = this.state.activeCreature + 1;
    let round = this.state.round;
    if (activeCreature === this.state.creatureCount) {
      activeCreature = 0;
      round = round + 1;
    }
    this.setState({...this.state, activeCreature, round});
  }

  sortCreatures(creatures) {
    return creatures.sort((creatureA, creatureB) => {
      return creatureB.initiative - creatureA.initiative;
    });
  }

  createCreature(creature) {
    const healthPoints = creature.healthPoints === '' ?
      undefined :
      parseInt(creature.healthPoints);

    const newCreature = {
      ...creature,
      initiative: parseInt(creature.initiative),
      healthPoints,
      id: this.state.creatureCount
    };
    
    const creatures = this.sortCreatures([...this.state.creatures, newCreature]);
    const creatureCount = this.state.creatureCount + 1;

    this.setState({...this.state, creatures, creatureCount});
  }

  render() {
    const secondsElapsed = (this.state.round - 1) * 6;

    return (
      <div className="App">
        <BattleToolbar
          round={this.state.round}
          secondsElapsed={secondsElapsed}
          combatants={this.state.creatureCount}
          nextCreature={this.nextCreature}
          resetBattle={this.resetBattle}
        />
        <Creatures
          creatures={this.state.creatures}
          activeCreature={this.state.activeCreature}
        />
        <CreateCreatureForm createCreature={this.createCreature} />
      </div>
    );
  }
}

export default App;
