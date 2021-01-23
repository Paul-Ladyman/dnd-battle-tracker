import React, { useState, useEffect } from 'react';
import BattleToolbar from '../page/BattleToolbar';
import Creatures from '../page/Creatures';
import Footer from '../page/Footer';
import Errors from '../error/Errors';
import Title from '../page/Title';
import { newBattleState } from '../../state/BattleManager';
import { getInitiative } from '../../state/InitiativeManager';
import getSecondsElapsed from '../../state/TimeManager';

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
  battleId, getLoading, syncLoading, getError, syncError, getData, syncData, onlineError,
}) {
  const [errors, setErrors] = useState(false);

  const battleData = getBattleData(getLoading, getData, syncLoading, syncData);

  const secondsElapsed = getSecondsElapsed(battleData);
  const {
    creatureCount, round, creatures, activeCreature, focusedCreature,
  } = battleData;

  useEffect(() => {
    if (onlineError || getError || syncError) {
      setErrors(true);
    }
  }, [onlineError, getError, syncError]);

  const loading = !getData && !syncData;

  return (
    <>
      <BattleToolbar
        initiative={getInitiative(battleData)}
        round={round}
        secondsElapsed={secondsElapsed}
        creatures={creatureCount}
        playerSession
      />
      { errors && (
      <Errors
        errors={['Error synchronising with Dungeon Master. Try refreshing the page.']}
        dismissErrors={() => setErrors(false)}
      />
      )}
      <div className="main-footer-wrapper">
        <main className="main">
          <Title
            battleId={battleId}
            playerSession
            loading={loading}
          />
          <Creatures
            creatures={creatures}
            activeCreature={activeCreature}
            focusedCreature={focusedCreature}
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
