import React, { Component } from 'react';
import './App.css';
import CreateCreatureForm from './CreateCreatureForm';
import Creatures from './Creatures';
import BattleToolbar from './BattleToolbar';
import conditions from './conditions';
import {
  newBattleState,
  getSecondsElapsed,
} from './BattleManager';
import {
  removeCreature,
  killCreature,
  reviveCreature,
  damageCreature,
  healCreature
} from './CreatureManager';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = newBattleState;

    this.createCreature = this.createCreature.bind(this);
    this.startBattle = this.startBattle.bind(this);
    this.nextCreature = this.nextCreature.bind(this);
    this.resetBattle = this.resetBattle.bind(this);
    this.killCreature = this.killCreature.bind(this);
    this.reviveCreature = this.reviveCreature.bind(this);
    this.damageCreature = this.damageCreature.bind(this);
    this.healCreature = this.healCreature.bind(this);
    this.removeCreature = this.removeCreature.bind(this);
    this.addNoteToCreature = this.addNoteToCreature.bind(this);
    this.removeNoteFromCreature = this.removeNoteFromCreature.bind(this);
    this.findCreature = this.findCreature.bind(this);
    this.getInitiative = this.getInitiative.bind(this);
  }

  resetBattle() {
    this.setState(newBattleState);
  }

  removeCreature(creatureId) {
    this.setState(removeCreature(this.state, creatureId));
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
    this.setState(killCreature(this.state, id));
  }

  reviveCreature(id) {
    this.setState(reviveCreature(this.state, id));
  }

  removeNoteFromCreature(creatureId, removedNote, isCondition) {
    const creature = this.findCreature(creatureId);
    const noteList = isCondition ? creature.conditions : creature.notes;
    const notes = noteList.filter((note) => {
      return note.text !== removedNote;
    });

    const newNotes = isCondition ? {conditions: notes} : {notes};
    this.updateCreature(creatureId, newNotes);
  }

  addNoteToCreature(creatureId, addedNote, isCondition) {
    const creature = this.findCreature(creatureId);
    const note = {
      text: addedNote,
      appliedAtRound: this.state.round,
      appliedAtSeconds: getSecondsElapsed(this.state)
    };

    if (isCondition) {
      const conditions = [...creature.conditions, note];
      this.updateCreature(creatureId, {conditions});
    }
    else {
      const notes = [...creature.notes, note];
      this.updateCreature(creatureId, {notes});
    }
  }

  damageCreature(creatureId, damage) {
    this.setState(damageCreature(this.state, creatureId, damage));
  }

  healCreature(creatureId, health) {
    this.setState(healCreature(this.state, creatureId, health));
  }

  startBattle() {
    const round = 1;
    const activeCreature = 0;
    this.setState({...this.state, activeCreature, round});
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
    const {healthPoints} = creature;
    const newCreature = {
      ...creature,
      maxHealthPoints: healthPoints,
      id: this.state.creatureIdCount,
      alive: true,
      conditions: [],
      notes: []
    };
    
    const creatures = this.sortCreatures([...this.state.creatures, newCreature]);

    let activeCreature = this.state.activeCreature;
    if (this.state.round > 0) {
      const currentlyActiveCreature = this.state.creatures[this.state.activeCreature];
      activeCreature = creatures.findIndex(({id}) => {
        return currentlyActiveCreature.id === id;
      });
    }

    const creatureCount = this.state.creatureCount + 1;
    const creatureIdCount = this.state.creatureIdCount + 1;

    this.setState({...this.state, creatures, creatureCount, creatureIdCount, activeCreature});
  }

  getInitiative() {
    if (this.state.round === 0) {
      return '';
    }

    return this.state.creatures.length > 0 ?
      this.state.creatures[this.state.activeCreature].name :
      '';
  }

  render() {
    const secondsElapsed = getSecondsElapsed(this.state);
    const nextButtonLabel = this.state.round === 0 ? 'Start' : 'Next';
    const nextButtonFunc = this.state.round === 0 ? this.startBattle : this.nextCreature;

    return (
      <div className="App">
        <BattleToolbar
          initiative={this.getInitiative()}
          round={this.state.round}
          secondsElapsed={secondsElapsed}
          combatants={this.state.creatureCount}
          nextButtonLabel={nextButtonLabel}
          nextButtonFunc={nextButtonFunc}
          resetBattle={this.resetBattle}
        />
        <Creatures
          creatures={this.state.creatures}
          activeCreature={this.state.activeCreature}
          conditions={conditions}
          round={this.state.round}
          secondsElapsed={secondsElapsed}
          killCreature={this.killCreature}
          reviveCreature={this.reviveCreature}
          damageCreature={this.damageCreature}
          healCreature={this.healCreature}
          removeCreature={this.removeCreature}
          addNoteToCreature={this.addNoteToCreature}
          removeNoteFromCreature={this.removeNoteFromCreature}
        />
        <CreateCreatureForm createCreature={this.createCreature} />
      </div>
    );
  }
}

export default App;
