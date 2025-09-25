import React, {
  useEffect,
  useRef,
  useMemo,
  useState,
  Suspense,
  lazy,
} from 'react';
import isHotkey from 'is-hotkey';
import '../App.css';
import BattleToolbar from '../page/BattleToolbar';
import Title from '../page/Title';
import AriaAnnouncements from '../page/AriaAnnouncements';
import RulesSearchBar from '../page/RulesSearchBar';
import {
  resetBattle,
  toggleSync,
} from '../../state/BattleManager';
import {
  nextInitiative,
  getInitiative,
} from '../../state/InitiativeManager';
import {
  removeCreature,
  getCreatureList,
} from '../../state/CreatureListManager';
import getSecondsElapsed from '../../state/TimeManager';
import {
  killCreature,
  stabilizeCreature,
  damageCreature,
  healCreature,
  addNoteToCreature,
  updateNoteForCreature,
  removeNoteFromCreature,
  addHitPointsToCreature,
  addTemporaryHealthToCreature,
  addArmorClassToCreature,
  addInitiativeToCreature,
  toggleCreatureLock,
  toggleCreatureShare,
  toggleCreatureHitPointsShare,
  addTotalSpellSlots,
  addUsedSpellSlots,
  addSpell,
  addSpellTotalUses,
  addSpellUses,
  addTieBreakerToCreature,
} from '../../state/CreatureManager';
import {
  save,
  load,
} from '../../state/SaveManager';
import Errors from '../error/Errors';
import { hotkeys } from '../../hotkeys/hotkeys';
import BattleManagerContext from './BattleManagerContext';
import {
  findCreatureWithError,
  battleHasErrors,
  dismissErrors,
  updateErrors,
} from '../../state/ErrorManager';
import { getSpellList } from '../../domain/spellcasting';
import SrdContext from './SrdContext';
import Loading from './Loading';
import ViewSwitcher from '../view/ViewSwitcher';
import InitiativeView from '../view/InitiativeView';
import ViewError from '../view/ViewError';

const DungeonMasterTips = lazy(async () => {
  try {
    return await import('../view/DungeonMasterTips');
  } catch {
    return { default: ViewError };
  }
});

function DungeonMasterApp({
  state, setState, shareBattle, onlineError,
}) {
  const [spellList, setSpellList] = useState([]);
  const [rulesSearchOpened, setRulesSearchOpened] = useState(false);
  const creaturesRef = useRef(null);

  const toggleRulesSearch = () => {
    setRulesSearchOpened((prev) => !prev);
  };

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

  const errors = battleHasErrors(state);
  const errorCreatureId = findCreatureWithError(state);

  const [round, activeCreatureName, activeCreatureId] = getInitiative(state);
  const [creatures, creatureCount] = getCreatureList(state);
  const secondsElapsed = getSecondsElapsed(round);
  const {
    shareEnabled,
    ariaAnnouncements,
    battleId,
    focusedCreature,
  } = state;

  useEffect(() => {
    getSpellList().then(setSpellList);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', hotKeyHandler);

    return () => window.removeEventListener('keydown', hotKeyHandler);
  }, []);

  useEffect(() => {
    if (onlineError) updateBattle(updateErrors, false)('Error sharing battle with players. Try toggling share button.');
  }, [onlineError]);

  const creatureManagement = {
    killCreature: updateBattle(killCreature),
    stabilizeCreature: updateBattle(stabilizeCreature),
    damageCreature: updateBattle(damageCreature),
    healCreature: updateBattle(healCreature),
    addHitPointsToCreature: updateBattle(addHitPointsToCreature),
    addTemporaryHealthToCreature: updateBattle(addTemporaryHealthToCreature, false),
    addArmorClassToCreature: updateBattle(addArmorClassToCreature, false),
    addInitiativeToCreature: updateBattle(addInitiativeToCreature),
    addTieBreakerToCreature: updateBattle(addTieBreakerToCreature),
    removeCreature: updateBattle(removeCreature),
    addNoteToCreature: updateBattle(addNoteToCreature),
    updateNoteForCreature: updateBattle(updateNoteForCreature),
    removeNoteFromCreature: updateBattle(removeNoteFromCreature),
    toggleCreatureLock: updateBattle(toggleCreatureLock, false),
    toggleCreatureShare: updateBattle(toggleCreatureShare),
    toggleCreatureHitPointsShare: updateBattle(toggleCreatureHitPointsShare),
    addTotalSpellSlots: updateBattle(addTotalSpellSlots),
    addUsedSpellSlots: updateBattle(addUsedSpellSlots),
    addSpell: updateBattle(addSpell),
    addSpellTotalUses: updateBattle(addSpellTotalUses),
    addSpellUses: updateBattle(addSpellUses),
  };

  const battleManagement = useMemo(() => ({
    toggleShare: updateBattle(toggleSync),
    toggleRulesSearch: updateBattle(toggleRulesSearch, false),
    resetBattle: updateBattle(resetBattle),
    saveBattle: updateBattle(save, false),
    loadBattle,
  }), [state]);

  const srd = useMemo(() => ({ spellList }));

  const onScrollActiveInitiative = () => {
    if (creaturesRef.current) {
      creaturesRef.current.scrollToCreature(activeCreatureId);
    }
  };

  useEffect(() => {
    onScrollActiveInitiative(activeCreatureId);
  }, [activeCreatureId]);

  useEffect(() => {
    if (errorCreatureId >= 0 && creaturesRef.current) {
      creaturesRef.current.scrollToCreature(errorCreatureId);
    }
  }, [errorCreatureId]);

  const views = [
    {
      id: 'initiative',
      title: 'Initiative',
      content: <InitiativeView
        updateBattle={updateBattle}
        state={state}
        creaturesRef={creaturesRef}
        creatures={creatures}
        activeCreatureId={activeCreatureId}
        errorCreatureId={errorCreatureId}
        focusedCreature={focusedCreature}
        round={round}
        secondsElapsed={secondsElapsed}
        creatureManagement={creatureManagement}
      />,
    },
    {
      id: 'dmtips',
      title: 'DM Tips',
      content: (
        <Suspense fallback={<Loading />}>
          <DungeonMasterTips />
        </Suspense>
      ),
    },
  ];

  return (
    <SrdContext.Provider value={srd}>
      <BattleManagerContext.Provider value={battleManagement}>
        <BattleToolbar
          initiative={activeCreatureName}
          round={round}
          secondsElapsed={secondsElapsed}
          creatureCount={creatureCount}
          nextInitiative={updateBattle(nextInitiative)}
          shareEnabled={shareEnabled}
          rulesSearchOpen={rulesSearchOpened}
          toggleRulesSearch={toggleRulesSearch}
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
            onSearch={toggleRulesSearch}
          />
          <Title
            shareEnabled={shareEnabled}
            battleId={battleId}
          />
          <ViewSwitcher views={views} />
        </div>
      </BattleManagerContext.Provider>
    </SrdContext.Provider>
  );
}

export default DungeonMasterApp;
