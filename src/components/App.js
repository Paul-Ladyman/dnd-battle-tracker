import React, { Component } from 'react';
import isHotkey from 'is-hotkey';
import './App.css';
import CreateCreatureForm from './CreateCreatureForm';
import Creatures from './Creatures';
import BattleToolbar from './BattleToolbar';
import conditions from '../model/conditions';
import {
  newBattleState,
  getSecondsElapsed,
  nextInitiative,
  getInitiative,
  nextFocus,
  prevFocus,
  setFocus,
  removeCreature,
  addCreature,
  resetBattle
} from '../state/BattleManager';
import {
  killCreature,
  stabalizeCreature,
  damageCreature,
  healCreature,
  addNoteToCreature,
  removeNoteFromCreature,
  addHealthToCreature,
  addInitiativeToCreature,
  toggleCreatureLock
} from '../state/CreatureManager';
import {
  save,
  load,
  isSaveLoadSupported,
  dismissErrors
} from '../state/AppManager';
import Footer from './Footer';
import Errors from './Errors';
import { hotkeys } from '../hotkeys/hotkeys';

class App extends Component {
  constructor(props) {
    super(props);

    const { playerSession } = this.props;

    this.state = playerSession ?
   {
      "creatures": [
        {
          "name": "goblin",
          "initiative": 1,
          "healthPoints": 1,
          "maxHealthPoints": 4,
          "id": 0,
          "alive": true,
          "conditions": [
            {
              "text": "Petrified",
              "appliedAtRound": 0,
              "appliedAtSeconds": 0,
              "url": "https://www.dndbeyond.com/sources/basic-rules/appendix-a-conditions#Petrified"
            }
          ],
          "notes": [
            {
              "text": "note",
              "appliedAtRound": 0,
              "appliedAtSeconds": 0
            }
          ],
          "locked": true
        }
      ],
      "creatureIdCount": 1,
      "creatureCount": 1,
      "round": 0
    } 
    : newBattleState;

    this.createCreature = this.createCreature.bind(this);
    this.nextInitiative = this.nextInitiative.bind(this);
    this.nextFocus = this.nextFocus.bind(this);
    this.prevFocus = this.prevFocus.bind(this);
    this.setFocus = this.setFocus.bind(this);
    this.resetBattle = this.resetBattle.bind(this);
    this.killCreature = this.killCreature.bind(this);
    this.stabalizeCreature = this.stabalizeCreature.bind(this);
    this.damageCreature = this.damageCreature.bind(this);
    this.healCreature = this.healCreature.bind(this);
    this.addHealthToCreature = this.addHealthToCreature.bind(this);
    this.addInitiativeToCreature = this.addInitiativeToCreature.bind(this);
    this.removeCreature = this.removeCreature.bind(this);
    this.addNoteToCreature = this.addNoteToCreature.bind(this);
    this.removeNoteFromCreature = this.removeNoteFromCreature.bind(this);
    this.toggleCreatureLock = this.toggleCreatureLock.bind(this);
    this.saveBattle = this.saveBattle.bind(this);
    this.loadBattle = this.loadBattle.bind(this);
    this.dismissErrors = this.dismissErrors.bind(this);
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
    this.setState(resetBattle(this.state));
  }

  removeCreature(creatureId) {
    this.setState(removeCreature(this.state, creatureId));
  }

  killCreature(id) {
    this.setState(killCreature(this.state, id));
  }

  stabalizeCreature(id) {
    this.setState(stabalizeCreature(this.state, id));
  }

  removeNoteFromCreature(creatureId, note, isCondition) {
    this.setState(removeNoteFromCreature(this.state, creatureId, note, isCondition));
  }

  addNoteToCreature(creatureId, text, isCondition) {
    this.setState(addNoteToCreature(this.state, creatureId, text, isCondition));
  }

  addInitiativeToCreature(creatureId, initiative) {
    this.setState(addInitiativeToCreature(this.state, creatureId, initiative));
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

  toggleCreatureLock(creatureId) {
    this.setState(toggleCreatureLock(this.state, creatureId));
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
    const newState = addCreature(this.state, creature)
    this.setState(newState);
    return Object.keys(newState.createCreatureErrors).length === 0;
  }

  saveBattle() {
    this.setState(save(this.state));
  }

  async loadBattle(file) {
    this.setState(await load(file, this.state));
  }

  dismissErrors() {
    this.setState(dismissErrors(this.state))
  }

  render() {
    const { playerSession } = this.props;

    const secondsElapsed = getSecondsElapsed(this.state);

    const creatureManagement = {
      killCreature: this.killCreature,
      stabalizeCreature: this.stabalizeCreature,
      damageCreature: this.damageCreature,
      healCreature: this.healCreature,
      addHealthToCreature: this.addHealthToCreature,
      addInitiativeToCreature: this.addInitiativeToCreature,
      removeCreature: this.removeCreature,
      addNoteToCreature: this.addNoteToCreature,
      removeNoteFromCreature: this.removeNoteFromCreature,
      toggleCreatureLock: this.toggleCreatureLock
    };

    const errors = this.state.errors && this.state.errors.length > 0;

    return (
      <React.Fragment>
        <BattleToolbar
          initiative={getInitiative(this.state)}
          round={this.state.round}
          secondsElapsed={secondsElapsed}
          creatures={this.state.creatureCount}
          nextInitiative={this.nextInitiative}
          resetBattle={this.resetBattle}
          saveBattle={this.saveBattle}
          loadBattle={this.loadBattle}
          isSaveLoadSupported={isSaveLoadSupported}
          playerSession={playerSession}
        />
        { errors && <Errors
            errors={this.state.errors}
            dismissErrors={this.dismissErrors}
          />
         }
        <div className="aria-announcements" role='region' aria-live="assertive">
          {this.state.ariaAnnouncements}
        </div>
        <div className="main-footer-wrapper">
          <main className="main">
           <h1 className="main-title">D&D Battle Tracker</h1>
           { !playerSession && <CreateCreatureForm
             createCreature={this.createCreature}
             createCreatureErrors={this.state.createCreatureErrors}
           />
           }
           <Creatures
             creatures={this.state.creatures}
             activeCreature={this.state.activeCreature}
             focusedCreature={this.state.focusedCreature}
             setFocus={this.setFocus}
             conditions={conditions}
             round={this.state.round}
             secondsElapsed={secondsElapsed}
             creatureManagement={creatureManagement}
             playerSession={playerSession}
            />
          </main>
          <Footer />
         </div>
      </React.Fragment>
    );
  }
}

export default App;
