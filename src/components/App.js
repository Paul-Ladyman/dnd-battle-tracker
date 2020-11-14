import React, { useState, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import { gql, useMutation } from '@apollo/client';
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

const ADD_BATTLE = gql`
mutation ADD_BATTLE($createdndbattletrackerinput: CreateDndbattletrackerInput!) {
  createDndbattletracker(input: $createdndbattletrackerinput) {
    battleId
    creatureCount
  }
}
`;

const UPDATE_BATTLE = gql`
mutation UPDATE_BATTLE($updatedndbattletrackerinput: UpdateDndbattletrackerInput!) {
  updateDndbattletracker(input: $updatedndbattletrackerinput) {
    battleId
    creatureCount
  }
}
`;

function App({ playerSession }) { 
  const initialState = playerSession ?
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
        },
        {
          "name": "goblin2",
          "initiative": 1,
          "healthPoints": 1,
          "maxHealthPoints": 1,
          "id": 1,
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
      "creatureIdCount": 2,
      "creatureCount": 2,
      "round": 0
    } 
    : newBattleState();

  const [state, setState] = useState(initialState);
  const [battleCreated, setBattleCreated] = useState(false);

  const [addBattle] = useMutation(ADD_BATTLE);
  const [syncBattle] = useMutation(UPDATE_BATTLE);

  useEffect(() => {
    window.onbeforeunload = () => {
      return true;
    };

    window.addEventListener('keydown', (e) => {
      if (!playerSession && isHotkey(hotkeys.nextInitiative, e)) {
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
    return async function() {
      const newState = await update(state, ...arguments);

      if (battleCreated) {
        syncBattle({ variables: { updatedndbattletrackerinput: {
          battleId: newState.battleId,
          creatureCount: newState.creatureCount
        }}});
      }
      else {
        addBattle({ variables: { createdndbattletrackerinput: {
          battleId: newState.battleId,
          creatureCount: newState.creatureCount
        }}});
      }
      setBattleCreated(true);
      setState(newState);
      return newState;
    };
  };

  const createCreature = async (creature) => {
    const newState = await updateBattle(addCreature)(creature);
    return Object.keys(newState.createCreatureErrors).length === 0;
  }

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

  console.log(state.battleId);

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
        playerSession={playerSession}
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
         <h1 className={`main-title${playerSession ? ' main-title--player-session' : ''}`}>
           D&D Battle Tracker
         </h1>
         { !playerSession && <CreateCreatureForm
           createCreature={createCreature}
           createCreatureErrors={state.createCreatureErrors}
           playerSession={playerSession}
         />
         }
         <Creatures
           creatures={state.creatures}
           activeCreature={state.activeCreature}
           focusedCreature={state.focusedCreature}
           setFocus={updateBattle(setFocus)}
           conditions={conditions}
           round={state.round}
           secondsElapsed={secondsElapsed}
           creatureManagement={creatureManagement}
           playerSession={playerSession}
          />
        </main>
        <Footer
          playerSession={playerSession}
        />
       </div>
    </React.Fragment>
  );
}

export default App;
