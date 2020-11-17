import React, { useState, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import { useMutation } from '@apollo/client';
import './App.css';
import CreateCreatureForm from './CreateCreatureForm';
import Creatures from './Creatures';
import BattleToolbar from './BattleToolbar';
import ExternalLink from './ExternalLink';
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
import { CREATE_BATTLE, UPDATE_BATTLE } from '../graphql/operations';

function DungeonMasterApp() { 
  const [state, setState] = useState(newBattleState());
  const [battleCreated, setBattleCreated] = useState(false);

  const [addBattleMutation] = useMutation(CREATE_BATTLE);
  const [updateBattleMutation] = useMutation(UPDATE_BATTLE);

  useEffect(() => {
    window.onbeforeunload = () => {
      return true;
    };

    window.addEventListener('keydown', (e) => {
      if (isHotkey(hotkeys.nextInitiative, e)) {
        updateBattle(nextInitiative)();
      }

      if (isHotkey(hotkeys.nextFocus, e)) {
        updateBattle(nextFocus)();
      }

      if (isHotkey(hotkeys.prevFocus, e)) {
        updateBattle(prevFocus)();
      }
    });
  });

  const updateBattle = (update) => {
    return function() {
      setState((prevState) => {
        const newState = update(prevState, ...arguments);

        // TODO abstract into SyncManager. Set battle created on state
        const syncBattle = battleCreated ? updateBattleMutation : addBattleMutation;
        syncBattle({ variables: { battleinput: {
          battleId: newState.battleId,
          creatureCount: newState.creatureCount,
          round: newState.round,
          creatures: newState.creatures,
          activeCreature: newState.activeCreature,
          focusedCreature: newState.focusedCreature
        }}});
        setBattleCreated(true);
        return newState;
      });
    };
  };

  const secondsElapsed = getSecondsElapsed(state);

  const creatureManagement = {
    killCreature: updateBattle(killCreature),
    stabalizeCreature: updateBattle(stabalizeCreature),
    damageCreature: updateBattle(damageCreature),
    healCreature: updateBattle(healCreature),
    addHealthToCreature: updateBattle(addHealthToCreature),
    addInitiativeToCreature: updateBattle(addInitiativeToCreature),
    removeCreature: updateBattle(removeCreature),
    addNoteToCreature: updateBattle(addNoteToCreature),
    removeNoteFromCreature: updateBattle(removeNoteFromCreature),
    toggleCreatureLock: updateBattle(toggleCreatureLock)
  };

  const errors = state.errors && state.errors.length > 0;

  return (
    <React.Fragment>
      <BattleToolbar
        initiative={getInitiative(state)}
        round={state.round}
        secondsElapsed={secondsElapsed}
        creatures={state.creatureCount}
        nextInitiative={updateBattle(nextInitiative)}
        resetBattle={updateBattle(resetBattle)}
        saveBattle={updateBattle(save)}
        loadBattle={updateBattle(load)}
        isSaveLoadSupported={isSaveLoadSupported}
      />
      { errors && <Errors
          errors={state.errors}
          dismissErrors={updateBattle(dismissErrors)}
        />
       }
      <div className="aria-announcements" role='region' aria-live="assertive">
        {state.ariaAnnouncements}
      </div>
      <div className="main-footer-wrapper">
        <main className="main">
         <h1 className="main-title">
           D&D Battle Tracker
         </h1>
         <h2>DM Session <ExternalLink url={`/?battle=${state.battleId}`}>{state.battleId}</ExternalLink></h2>
         <CreateCreatureForm
           createCreature={updateBattle(addCreature)}
           createCreatureErrors={state.createCreatureErrors}
         />
         <Creatures
           creatures={state.creatures}
           activeCreature={state.activeCreature}
           focusedCreature={state.focusedCreature}
           setFocus={updateBattle(setFocus)}
           conditions={conditions}
           round={state.round}
           secondsElapsed={secondsElapsed}
           creatureManagement={creatureManagement}
          />
        </main>
        <Footer/>
       </div>
    </React.Fragment>
  );
}

export default DungeonMasterApp;
