import React, { useEffect, useRef } from 'react';
import isHotkey from 'is-hotkey';
import '../App.css';
import CreateCreatureForm from '../page/create-creature-form/CreateCreatureForm';
import Creatures from '../page/Creatures';
import BattleToolbar from '../page/BattleToolbar';
import Title from '../page/Title';
import AriaAnnouncements from '../page/AriaAnnouncements';
import RulesSearchBar from '../page/RulesSearchBar';
import {
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
import { handleCreateCreatureErrors } from '../../state/CreatureFormManager';
import Footer from '../page/footer/Footer';
import Errors from '../error/Errors';
import { hotkeys } from '../../hotkeys/hotkeys';

function DungeonMasterApp({
  state, setState, shareBattle, onlineError,
}) {
  const creaturesRef = useRef(null);

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
    focusedCreature,
  } = state;

  useEffect(() => {
    window.onbeforeunload = () => true;

    window.addEventListener('keydown', hotKeyHandler);

    return () => window.removeEventListener('keydown', hotKeyHandler);
  }, []);

  useEffect(() => {
    if (onlineError) updateBattle(updateErrors, false)('Error sharing battle with players. Try toggling share button.');
  }, [onlineError]);

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

  const onScrollActiveInitiative = () => {
    creaturesRef.current.scrollToCreature(activeCreatureId);
  };

  useEffect(() => {
    onScrollActiveInitiative(activeCreatureId);
  }, [activeCreatureId]);

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
        onScrollActiveInitiative={onScrollActiveInitiative}
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
          />
          <CreateCreatureForm
            createCreature={updateBattle(addCreature)}
            handleCreateCreatureErrors={updateBattle(handleCreateCreatureErrors)}
            createCreatureErrors={state.createCreatureErrors}
          />
          <Creatures
            ref={creaturesRef}
            creatures={creatures}
            activeCreatureId={activeCreatureId}
            focusedCreature={focusedCreature}
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
