import React, { Component } from 'react';
import isHotkey from 'is-hotkey';
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
  nextFocus,
  prevFocus,
  setFocus,
  removeCreature,
  addCreature
} from './BattleManager';
import {
  killCreature,
  reviveCreature,
  damageCreature,
  healCreature,
  addNoteToCreature,
  removeNoteFromCreature,
  addHealthToCreature
} from './CreatureManager';
import Footer from './Footer';
import { hotkeys } from './hotkeys';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = newBattleState;

    this.createCreature = this.createCreature.bind(this);
    this.nextInitiative = this.nextInitiative.bind(this);
    this.nextFocus = this.nextFocus.bind(this);
    this.prevFocus = this.prevFocus.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.resetBattle = this.resetBattle.bind(this);
    this.killCreature = this.killCreature.bind(this);
    this.reviveCreature = this.reviveCreature.bind(this);
    this.damageCreature = this.damageCreature.bind(this);
    this.healCreature = this.healCreature.bind(this);
    this.addHealthToCreature = this.addHealthToCreature.bind(this);
    this.removeCreature = this.removeCreature.bind(this);
    this.addNoteToCreature = this.addNoteToCreature.bind(this);
    this.removeNoteFromCreature = this.removeNoteFromCreature.bind(this);
  }

  componentDidMount() {
    window.onbeforeunload = () => {
      return true;
    };

    window.addEventListener('keydown', (e) => {
      if (isHotkey(hotkeys.nextInitiative, e)) {
        this.nextInitiative();
      }

      if (isHotkey(hotkeys.nextFocus, e)) {
        this.nextFocus();
      }

      if (isHotkey(hotkeys.prevFocus, e)) {
        this.prevFocus();
      }
    });
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

  addHealthToCreature(creatureId, health) {
    this.setState(addHealthToCreature(this.state, creatureId, health));
  }

  nextInitiative() {
    this.setState(nextInitiative(this.state));
  }

  nextFocus() {
    this.setState(nextFocus(this.state));
  }

  prevFocus() {
    this.setState(prevFocus(this.state));
  }

  setFocus(creature) {
    this.setState(setFocus(this.state, creature));
  }

  createCreature(creature) {
    this.setState(addCreature(this.state, creature));
  }

  render() {
    const secondsElapsed = getSecondsElapsed(this.state);

    const creatureManagement = {
      killCreature: this.killCreature,
      reviveCreature: this.reviveCreature,
      damageCreature: this.damageCreature,
      healCreature: this.healCreature,
      addHealthToCreature: this.addHealthToCreature,
      removeCreature: this.removeCreature,
      addNoteToCreature: this.addNoteToCreature,
      removeNoteFromCreature: this.removeNoteFromCreature
    };

    return (
      <React.Fragment>
        <BattleToolbar
          initiative={getInitiative(this.state)}
          round={this.state.round}
          secondsElapsed={secondsElapsed}
          combatants={this.state.creatureCount}
          nextInitiative={this.nextInitiative}
          resetBattle={this.resetBattle}
        />
        <div className="main-footer-wrapper">
          <main className="main">
           <CreateCreatureForm createCreature={this.createCreature} />
           <Creatures
             creatures={this.state.creatures}
             activeCreature={this.state.activeCreature}
             focusedCreature={this.state.focusedCreature}
             setFocus={this.setFocus}
             conditions={conditions}
             round={this.state.round}
             secondsElapsed={secondsElapsed}
             creatureManagement={creatureManagement}
            />
          </main>
          <Footer />
         </div>
      </React.Fragment>
    );
  }
}

export default App;
