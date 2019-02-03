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
      activeCreature: undefined,
      round: 0
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
      'stunned'
    ];

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
    this.getSecondsElapsed = this.getSecondsElapsed.bind(this);
    this.getInitiative = this.getInitiative.bind(this);
  }

  getSecondsElapsed() {
    if (this.state.round === 0) {
      return 0;
    }
    return (this.state.round - 1) * 6;
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
    const creature = this.findCreature(id);
    const healthPoints = creature.healthPoints === undefined ? undefined : 0;
    this.updateCreature(id, {alive: false, healthPoints});
  }

  reviveCreature(id) {
    this.updateCreature(id, {alive: true});
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
      appliedAtSeconds: this.getSecondsElapsed()
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
    const creature = this.findCreature(creatureId)

    let healthPoints = creature.healthPoints - damage;
    let alive = true;

    if (healthPoints <= 0) {
      healthPoints = 0;
      alive = false;
    }

    this.updateCreature(creatureId, {alive, healthPoints});
  }

  healCreature(creatureId, heal) {
    const creature = this.findCreature(creatureId);

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
    const {initiative, healthPoints} = creature;
    const newCreature = {
      ...creature,
      initiative,
      maxHealthPoints: healthPoints,
      healthPoints,
      id: this.state.creatureIdCount,
      alive: true,
      conditions: [],
      notes: []
    };
    
    const currentlyActiveCreature = this.state.creatures[this.state.activeCreature];
    const creatures = this.sortCreatures([...this.state.creatures, newCreature]);

    let activeCreature = this.state.activeCreature;
    if (this.state.round > 0) {
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
    const secondsElapsed = this.getSecondsElapsed();
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
          conditions={this.conditions}
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
