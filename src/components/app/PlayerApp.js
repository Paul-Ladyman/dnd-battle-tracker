import React, { useState, useEffect, useRef } from 'react';
import isHotkey from 'is-hotkey';
import BattleToolbar from '../page/BattleToolbar';
import Creatures from '../page/Creatures';
import Footer from '../page/footer/Footer';
import Errors from '../error/Errors';
import Title from '../page/Title';
import RulesSearchBar from '../page/RulesSearchBar';
import AriaAnnouncements from '../page/AriaAnnouncements';
import { newBattleState, toggleRulesSearch } from '../../state/BattleManager';
import { getInitiative } from '../../state/InitiativeManager';
import getSecondsElapsed from '../../state/TimeManager';
import { getCreatureList } from '../../state/CreatureListManager';
import { hotkeys } from '../../hotkeys/hotkeys';

// TODO abstract into SyncManager
function getBattleData(getLoading, getData, syncLoading, syncData) {
  if (!syncLoading && syncData && syncData.onUpdateDndbattletracker) {
    return syncData.onUpdateDndbattletracker;
  }

  if (!getLoading && getData && getData.getDndbattletracker) {
    return getData.getDndbattletracker;
  }

  return newBattleState;
}

function PlayerApp({
  state,
  setState,
  battleId,
  getLoading,
  syncLoading,
  getError,
  syncError,
  getData,
  syncData,
  onlineError,
}) {
  const [errors, setErrors] = useState(false);

  const battleData = getBattleData(getLoading, getData, syncLoading, syncData);

  const creaturesRef = useRef();

  useEffect(() => {
    if (onlineError || getError || syncError) {
      setErrors(true);
    }
  }, [onlineError, getError, syncError]);

  const updateRulesSearch = () => setState((prevState) => toggleRulesSearch(prevState));

  const hotKeyHandler = (e) => {
    if (isHotkey(hotkeys.rulesSearchBar, e)) {
      e.preventDefault();
      updateRulesSearch();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', hotKeyHandler);

    return () => window.removeEventListener('keydown', hotKeyHandler);
  }, []);

  const loading = !getData && !syncData;

  const [round, activeCreatureName, activeCreatureId] = getInitiative(battleData, true);
  const [creatures, creatureCount] = getCreatureList(battleData, true);
  const secondsElapsed = getSecondsElapsed(round);
  const { rulesSearchOpened, ariaAnnouncements } = state;

  const onScrollActiveInitiative = () => {
    creaturesRef?.current?.scrollToCreature(activeCreatureId);
  };

  return (
    <>
      <BattleToolbar
        initiative={activeCreatureName}
        round={round}
        secondsElapsed={secondsElapsed}
        creatureCount={creatureCount}
        rulesSearchOpen={rulesSearchOpened}
        toggleRulesSearch={updateRulesSearch}
        playerSession
        onScrollActiveInitiative={onScrollActiveInitiative}
      />
      { errors && (
      <Errors
        errors={['Error synchronising with Dungeon Master. Try refreshing the page.']}
        dismissErrors={() => setErrors(false)}
      />
      )}
      <AriaAnnouncements announcements={ariaAnnouncements} />
      <div className="main-footer-wrapper">
        <RulesSearchBar rulesSearchOpened={rulesSearchOpened} onSearch={updateRulesSearch} />
        <main className="main">
          <Title
            battleId={battleId}
            playerSession
            loading={loading}
          />
          <Creatures
            ref={creaturesRef}
            creatures={creatures}
            activeCreatureId={activeCreatureId}
            round={round}
            secondsElapsed={secondsElapsed}
            creatureManagement={{}}
            playerSession
          />
        </main>
        <Footer playerSession />
      </div>
    </>
  );
}

export default PlayerApp;
