import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CreateCreatureForm from './CreateCreatureForm';
import Creature from './Creature';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      creatures: []
    };

    this.createCreature = this.createCreature.bind(this);
  }

  insertAndSortCreatures(creature) {
    const creatures = [...this.state.creatures, creature];
    return creatures.sort((creatureA, creatureB) => {
      return creatureB.initiative - creatureA.initiative;
    });
  }

  createCreature(creature) {
    const newCreature = {
      ...creature,
      initiative: parseInt(creature.initiative),
      healthPoints: parseInt(creature.healthPoints)
    };

    this.setState({...this.state, creatures: this.insertAndSortCreatures(newCreature)});
  }

  render() {
    return (
      <div className="App">
        {
          this.state.creatures.map((creature) => {
            return <Creature creature={creature} />
          })
        }
        <CreateCreatureForm createCreature={this.createCreature} />
      </div>
    );
  }
}

export default App;
