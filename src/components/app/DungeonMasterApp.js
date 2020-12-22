import React, { useEffect } from 'react';
import isHotkey from 'is-hotkey';
import '../App.css';
import CreateCreatureForm from '../CreateCreatureForm';
import Creatures from '../Creatures';
import BattleToolbar from '../BattleToolbar';
import Title from '../Title';
import conditions from '../../model/conditions';
import {
  nextInitiative,
  getInitiative,
  nextFocus,
  prevFocus,
  setFocus,
  removeCreature,
  addCreature,
  resetBattle,
  toggleSync,
} from '../../state/BattleManager';
import getSecondsElapsed from '../../state/TimeManager';
import {
  killCreature,
  stabalizeCreature,
  damageCreature,
  healCreature,
  addNoteToCreature,
  removeNoteFromCreature,
  addHealthToCreature,
  addInitiativeToCreature,
  toggleCreatureLock,
} from '../../state/CreatureManager';
import {
  save,
  load,
  isSaveLoadSupported,
  dismissErrors,
  updateErrors,
} from '../../state/AppManager';
import Footer from '../Footer';
import Errors from '../Errors';
import { hotkeys } from '../../hotkeys/hotkeys';

function DungeonMasterApp({
  state, setState, shareBattle, onlineError,
}) {
  const updateBattle = (update, doShare = true) => (...args) => {
    setState((prevState) => {
      const newState = update(prevState, ...args);
      if (doShare) return shareBattle(newState);
      return newState;
    });
  };

  const hotKeyHandler = (e) => {
    if (isHotkey(hotkeys.nextInitiative, e)) {
      updateBattle(nextInitiative)();
    }

    if (isHotkey(hotkeys.nextFocus, e)) {
      updateBattle(nextFocus, false)();
    }

    if (isHotkey(hotkeys.prevFocus, e)) {
      updateBattle(prevFocus, false)();
    }
  };

  useEffect(() => {
    window.onbeforeunload = () => true;

    window.addEventListener('keydown', hotKeyHandler);

    return () => window.removeEventListener('keydown', hotKeyHandler);
  }, []);

  const loadBattle = async (file) => {
    const newState = shareBattle(await load(state, file));
    setState(newState);
  };

  useEffect(() => {
    if (onlineError) updateBattle(updateErrors, false)('Error sharing battle with players. Try toggling share button.');
  }, [onlineError]);

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
    toggleCreatureLock: updateBattle(toggleCreatureLock, false),
  };

  const errors = state.errors && state.errors.length > 0;

  return (
    <>
      <BattleToolbar
        initiative={getInitiative(state)}
        round={state.round}
        secondsElapsed={secondsElapsed}
        creatures={state.creatureCount}
        nextInitiative={updateBattle(nextInitiative)}
        resetBattle={updateBattle(resetBattle)}
        saveBattle={updateBattle(save, false)}
        loadBattle={loadBattle}
        toggleShare={updateBattle(toggleSync)}
        shareEnabled={state.shareEnabled}
        isSaveLoadSupported={isSaveLoadSupported}
      />
      { errors && (
      <Errors
        errors={state.errors}
        dismissErrors={updateBattle(dismissErrors, false)}
      />
      )}
      <div className="aria-announcements" role="region" aria-live="assertive">
        {state.ariaAnnouncements}
      </div>
      <div className="main-footer-wrapper">
        <main className="main">
          <Title
            shareEnabled={state.shareEnabled}
            battleId={state.battleId}
          />
          <CreateCreatureForm
            createCreature={updateBattle(addCreature)}
            createCreatureErrors={state.createCreatureErrors}
          />
          <Creatures
            creatures={state.creatures}
            activeCreature={state.activeCreature}
            focusedCreature={state.focusedCreature}
            setFocus={updateBattle(setFocus, false)}
            conditions={conditions}
            round={state.round}
            secondsElapsed={secondsElapsed}
            creatureManagement={creatureManagement}
          />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default DungeonMasterApp;
