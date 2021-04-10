import React, { useEffect, useState } from 'react';
import isHotkey from 'is-hotkey';
import '../App.css';
import CreateCreatureForm from '../page/CreateCreatureForm';
import Creatures from '../page/Creatures';
import BattleToolbar from '../page/BattleToolbar';
import Title from '../page/Title';
import {
  nextFocus,
  prevFocus,
  setFocus,
  resetBattle,
  toggleSync,
} from '../../state/BattleManager';
import {
  nextInitiative,
  getInitiative,
} from '../../state/InitiativeManager';
import {
  removeCreature,
  addCreature,
  getCreatureList,
} from '../../state/CreatureListManager';
import getSecondsElapsed from '../../state/TimeManager';
import {
  killCreature,
  stabalizeCreature,
  damageCreature,
  healCreature,
  addNoteToCreature,
  removeNoteFromCreature,
  addHealthToCreature,
  addTemporaryHealthToCreature,
  addInitiativeToCreature,
  toggleCreatureLock,
  toggleCreatureShare,
} from '../../state/CreatureManager';
import {
  save,
  load,
  isSaveLoadSupported,
  dismissErrors,
  updateErrors,
} from '../../state/AppManager';
import Footer from '../page/Footer';
import Errors from '../error/Errors';
import { hotkeys } from '../../hotkeys/hotkeys';
import NotesTool from '../creature/toolbar/NotesTool';

function DungeonMasterApp({
  state, setState, shareBattle, onlineError,
}) {
  const [showSidePanel, setShowSidePanel] = useState(false);
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

    if (isHotkey(hotkeys.dndBeyondSearch, e)) {
      setShowSidePanel((prev) => !prev);
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

  const creatureManagement = {
    killCreature: updateBattle(killCreature),
    stabalizeCreature: updateBattle(stabalizeCreature),
    damageCreature: updateBattle(damageCreature),
    healCreature: updateBattle(healCreature),
    addHealthToCreature: updateBattle(addHealthToCreature),
    addTemporaryHealthToCreature: updateBattle(addTemporaryHealthToCreature, false),
    addInitiativeToCreature: updateBattle(addInitiativeToCreature),
    removeCreature: updateBattle(removeCreature),
    addNoteToCreature: updateBattle(addNoteToCreature),
    removeNoteFromCreature: updateBattle(removeNoteFromCreature),
    toggleCreatureLock: updateBattle(toggleCreatureLock, false),
    toggleCreatureShare: updateBattle(toggleCreatureShare),
  };

  const errors = state.errors && state.errors.length > 0;

  const [round, activeCreatureName, activeCreatureId] = getInitiative(state);
  const [creatures, creatureCount] = getCreatureList(state);
  const secondsElapsed = getSecondsElapsed(round);

  const mainWrapperClass = showSidePanel ? 'main-footer-wrapper main-footer-wrapper__right' : 'main-footer-wrapper';

  return (
    <>
      <BattleToolbar
        initiative={activeCreatureName}
        round={round}
        secondsElapsed={secondsElapsed}
        creatureCount={creatureCount}
        nextInitiative={() => { setShowSidePanel((prev) => !prev); updateBattle(nextInitiative); }}
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
      <div className="main-side-wrapper">
        {showSidePanel && (
          <div className="side-panel">
            <div className="dnd-beyond-search">
              <NotesTool />
            </div>
          </div>
        )}
        <div className={mainWrapperClass}>
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
              creatures={creatures}
              activeCreatureId={activeCreatureId}
              focusedCreature={state.focusedCreature}
              setFocus={updateBattle(setFocus, false)}
              round={round}
              secondsElapsed={secondsElapsed}
              creatureManagement={creatureManagement}
            />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default DungeonMasterApp;
