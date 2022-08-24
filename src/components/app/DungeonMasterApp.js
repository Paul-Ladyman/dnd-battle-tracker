import React, { useEffect, useState } from 'react';
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
  updateNoteForCreature,
  removeNoteFromCreature,
  addHitPointsToCreature,
  addTemporaryHealthToCreature,
  addInitiativeToCreature,
  toggleCreatureLock,
  toggleCreatureShare,
  toggleCreatureHitPointsShare,
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

  const loadBattle = async (file) => {
    const newState = shareBattle(await load(state, file));
    setState(newState);
  };

  const errors = state.errors && state.errors.length > 0;

  const [round, activeCreatureName, activeCreatureId] = getInitiative(state);
  const [creatures, creatureCount] = getCreatureList(state);
  const secondsElapsed = getSecondsElapsed(round);
  const {
    shareEnabled,
    rulesSearchOpened,
    ariaAnnouncements,
    battleId,
  } = state;

  const [playerLinkCopied, setPlayerLinkCopied] = useState(false);

  useEffect(() => {
    window.onbeforeunload = () => true;

    window.addEventListener('keydown', hotKeyHandler);

    return () => window.removeEventListener('keydown', hotKeyHandler);
  }, []);

  useEffect(() => {
    if (onlineError) updateBattle(updateErrors, false)('Error sharing battle with players. Try toggling share button.');
  }, [onlineError]);

  useEffect(() => {
    if (shareEnabled && battleId) {
      const { href } = window.location;
      const url = `${href}?battle=${battleId}`;
      const copyPlayerLink = async () => {
        try {
          await window.navigator.clipboard.writeText(url);
          setPlayerLinkCopied(true);
        } catch {
          //
        }
      };
      copyPlayerLink();
    }
  }, [shareEnabled, battleId]);

  const creatureManagement = {
    killCreature: updateBattle(killCreature),
    stabalizeCreature: updateBattle(stabalizeCreature),
    damageCreature: updateBattle(damageCreature),
    healCreature: updateBattle(healCreature),
    addHitPointsToCreature: updateBattle(addHitPointsToCreature),
    addTemporaryHealthToCreature: updateBattle(addTemporaryHealthToCreature, false),
    addInitiativeToCreature: updateBattle(addInitiativeToCreature),
    removeCreature: updateBattle(removeCreature),
    addNoteToCreature: updateBattle(addNoteToCreature),
    updateNoteForCreature: updateBattle(updateNoteForCreature),
    removeNoteFromCreature: updateBattle(removeNoteFromCreature),
    toggleCreatureLock: updateBattle(toggleCreatureLock, false),
    toggleCreatureShare: updateBattle(toggleCreatureShare),
    toggleCreatureHitPointsShare: updateBattle(toggleCreatureHitPointsShare),
  };

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
        <RulesSearchBar
          rulesSearchOpened={rulesSearchOpened}
          onSearch={updateBattle(toggleRulesSearch, false)}
        />
        <main className="main">
          <Title
            shareEnabled={shareEnabled}
            battleId={battleId}
            playerLinkCopied={playerLinkCopied}
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
