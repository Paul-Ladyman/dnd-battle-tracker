import React, { Component } from 'react';
import './App.css';
import CreateCreatureForm from './CreateCreatureForm';
import Creatures from './Creatures';
import BattleToolbar from './BattleToolbar';
import conditions from './conditions';
import {
  newBattleState,
  getSecondsElapsed,
  nextInitiative,
  getInitiative,
  removeCreature,
  addCreature
} from './BattleManager';
import {
  killCreature,
  reviveCreature,
  damageCreature,
  healCreature,
  addNoteToCreature,
  removeNoteFromCreature
} from './CreatureManager';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = newBattleState;

    this.createCreature = this.createCreature.bind(this);
    this.nextInitiative = this.nextInitiative.bind(this);
    this.resetBattle = this.resetBattle.bind(this);
    this.killCreature = this.killCreature.bind(this);
    this.reviveCreature = this.reviveCreature.bind(this);
    this.damageCreature = this.damageCreature.bind(this);
    this.healCreature = this.healCreature.bind(this);
    this.removeCreature = this.removeCreature.bind(this);
    this.addNoteToCreature = this.addNoteToCreature.bind(this);
    this.removeNoteFromCreature = this.removeNoteFromCreature.bind(this);
  }

  resetBattle() {
    this.setState(newBattleState);
  }

  removeCreature(creatureId) {
    this.setState(removeCreature(this.state, creatureId));
  }

  killCreature(id) {
    this.setState(killCreature(this.state, id));
  }

  reviveCreature(id) {
    this.setState(reviveCreature(this.state, id));
  }

  removeNoteFromCreature(creatureId, note, isCondition) {
    this.setState(removeNoteFromCreature(this.state, creatureId, note, isCondition));
  }

  addNoteToCreature(creatureId, text, isCondition) {
    this.setState(addNoteToCreature(this.state, creatureId, text, isCondition));
  }

  damageCreature(creatureId, damage) {
    this.setState(damageCreature(this.state, creatureId, damage));
  }

  healCreature(creatureId, health) {
    this.setState(healCreature(this.state, creatureId, health));
  }

  nextInitiative() {
    this.setState(nextInitiative(this.state));
  }

  createCreature(creature) {
    this.setState(addCreature(this.state, creature));
  }

  render() {
    const secondsElapsed = getSecondsElapsed(this.state);
    const nextButtonLabel = this.state.round === 0 ? 'Start' : 'Next';

    return (
      <div className="App">
        <BattleToolbar
          initiative={getInitiative(this.state)}
          round={this.state.round}
          secondsElapsed={secondsElapsed}
          combatants={this.state.creatureCount}
          nextButtonLabel={nextButtonLabel}
          nextInitiative={this.nextInitiative}
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
