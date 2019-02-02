import React, { Component } from 'react';
import './App.css';
import CreateCreatureForm from './CreateCreatureForm';
import Creatures from './Creatures';
import BattleToolbar from './BattleToolbar';

class App extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      creatures: [],
      creatureIdCount: 0,
      creatureCount: 0,
      activeCreature: 0,
      round: 1
    };

    this.state = this.initialState;

    this.conditions = [
      'blinded',
      'charmed',
      'defeaned',
      'frightened',
      'grappled',
      'incapacitated',
      'invisible',
      'paralyzed',
      'petrified',
      'poisoned',
      'prone',
      'restrained',
      'stunned',
      'unconscious'
    ];

    this.createCreature = this.createCreature.bind(this);
    this.nextCreature = this.nextCreature.bind(this);
    this.resetBattle = this.resetBattle.bind(this);
    this.killCreature = this.killCreature.bind(this);
    this.reviveCreature = this.reviveCreature.bind(this);
    this.damageCreature = this.damageCreature.bind(this);
    this.healCreature = this.healCreature.bind(this);
    this.removeCreature = this.removeCreature.bind(this);
    this.addConditionToCreature = this.addConditionToCreature.bind(this);
    this.removeConditionFromCreature = this.removeConditionFromCreature.bind(this);
    this.findCreature = this.findCreature.bind(this);
  }

  resetBattle() {
    this.setState(this.initialState);
  }

  removeCreature(creatureId) {
    const currentlyActiveCreature = this.state.creatures[this.state.activeCreature];

    const creatures = this.state.creatures.filter(({id}) => {
      return creatureId !== id;
    });

    const activeCreature = creatures.findIndex(({id}) => {
      return currentlyActiveCreature.id === id;
    });

    const creatureCount = this.state.creatureCount - 1;

    this.setState({...this.state, creatures, activeCreature, creatureCount});
  }

  findCreature(creatureId) {
    return this.state.creatures.find(({id}) => {
      return creatureId === id;
    });
  }

  updateCreature(id, updates) {
    let newCreatures = [...this.state.creatures];
    const creatureIndex = newCreatures.findIndex((creature) => {
      return creature.id === id;
    });
    const existingCreature = newCreatures[creatureIndex]
    newCreatures[creatureIndex] = {...existingCreature, ...updates};

    this.setState({...this.state, creatures: newCreatures});
  }

  killCreature(id) {
    this.updateCreature(id, {alive: false});
  }

  reviveCreature(id) {
    this.updateCreature(id, {alive: true});
  }

  removeConditionFromCreature(creatureId, conditionName) {
    const creature = this.findCreature(creatureId);
    const conditions = creature.conditions.filter((condition) => {
      return condition.name !== conditionName;
    });
    this.updateCreature(creatureId, {conditions});
  }

  addConditionToCreature(creatureId, conditionName) {
    const creature = this.findCreature(creatureId);
    const condition = {
      name: conditionName
    }
    const conditions = [...creature.conditions, condition];
    this.updateCreature(creatureId, {conditions});
  }

  damageCreature(creatureId, damage) {
    const creature = this.state.creatures.find(({id}) => {
      return creatureId === id;
    });

    let healthPoints = creature.healthPoints - damage;
    let alive = true;

    if (healthPoints <= 0) {
      healthPoints = 0;
      alive = false;
    }

    this.updateCreature(creatureId, {alive, healthPoints});
  }

  healCreature(creatureId, heal) {
    const creature = this.state.creatures.find(({id}) => {
      return creatureId === id;
    });

    let healthPoints = creature.healthPoints + heal;
    let alive = false;

    if (healthPoints > creature.maxHealthPoints) {
      healthPoints = creature.maxHealthPoints;
    }

    if (healthPoints > 0) {
      alive = true;
    }

    this.updateCreature(creatureId, {alive, healthPoints});
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
    const {initiative, healthPoints} = creature;
    const newCreature = {
      ...creature,
      initiative,
      maxHealthPoints: healthPoints,
      healthPoints,
      id: this.state.creatureIdCount,
      alive: true,
      conditions: []
    };
    
    const creatures = this.sortCreatures([...this.state.creatures, newCreature]);
    const creatureCount = this.state.creatureCount + 1;
    const creatureIdCount = this.state.creatureIdCount + 1;

    this.setState({...this.state, creatures, creatureCount, creatureIdCount});
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
          conditions={this.conditions}
          killCreature={this.killCreature}
          reviveCreature={this.reviveCreature}
          damageCreature={this.damageCreature}
          healCreature={this.healCreature}
          removeCreature={this.removeCreature}
          addConditionToCreature={this.addConditionToCreature}
          removeConditionFromCreature={this.removeConditionFromCreature}
        />
        <CreateCreatureForm createCreature={this.createCreature} />
      </div>
    );
  }
}

export default App;
