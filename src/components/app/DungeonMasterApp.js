import React, { useEffect } from 'react';
import isHotkey from 'is-hotkey';
import '../App.css';
import CreateCreatureForm from '../page/CreateCreatureForm';
import Creatures from '../page/Creatures';
import BattleToolbar from '../page/BattleToolbar';
import Title from '../page/Title';
import AriaAnnouncements from '../page/AriaAnnouncements';
import RulesSearchBar from '../page/RulesSearchBar';
import {
  nextFocus,
  prevFocus,
  setFocus,
  resetBattle,
  toggleSync,
  toggleRulesSearch,
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

    if (isHotkey(hotkeys.rulesSearchBar, e)) {
      e.preventDefault();
      updateBattle(toggleRulesSearch, false)();
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
  const { shareEnabled, rulesSearchOpened, ariaAnnouncements } = state;

  return (
    <>
      <BattleToolbar
        initiative={activeCreatureName}
        round={round}
        secondsElapsed={secondsElapsed}
        creatureCount={creatureCount}
        nextInitiative={updateBattle(nextInitiative)}
        resetBattle={updateBattle(resetBattle)}
        saveBattle={updateBattle(save, false)}
        loadBattle={loadBattle}
        toggleShare={updateBattle(toggleSync)}
        shareEnabled={shareEnabled}
        isSaveLoadSupported={isSaveLoadSupported}
        rulesSearchOpen={rulesSearchOpened}
        toggleRulesSearch={updateBattle(toggleRulesSearch, false)}
      />
      { errors && (
      <Errors
        errors={state.errors}
        dismissErrors={updateBattle(dismissErrors, false)}
      />
      )}
      <AriaAnnouncements announcements={ariaAnnouncements} />
      <div className="main-footer-wrapper">
        <RulesSearchBar rulesSearchOpened={rulesSearchOpened} />
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
    </>
  );
}

export default DungeonMasterApp;
