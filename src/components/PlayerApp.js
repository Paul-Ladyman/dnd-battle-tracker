import { useQuery, useSubscription } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { GET_BATTLE, SYNC_BATTLE } from '../graphql/operations';
import BattleToolbar from './BattleToolbar';
import Creatures from './Creatures';
import Footer from './Footer';
import Errors from './Errors';
import { 
  newBattleState,
  getSecondsElapsed,
  getInitiative
} from '../state/BattleManager';


// TODO abstract into SyncManager
function getBattleData(queryDataLoading, queryData, subLoading, subData) {
  if (!subLoading && subData && subData.onUpdateDndbattletracker) {
    return subData.onUpdateDndbattletracker;
  }
  
  if (!queryDataLoading && queryData && queryData.getDndbattletracker) {
    return queryData.getDndbattletracker;
  }

  return newBattleState();
}

function PlayerApp({ battleId }) {
  const [errors, setErrors] = useState(false);

  const { loading, error, data } = useQuery(GET_BATTLE, {
    variables: { battleId }
  });

  const { loading: syncLoading, error: syncError, data:syncData } = useSubscription(SYNC_BATTLE, {
    variables: { battleId }
  });

  const battleData = getBattleData(loading, data, syncLoading, syncData);

  const secondsElapsed = getSecondsElapsed(battleData);
  const { creatureCount, round, creatures, activeCreature, focusedCreature } = battleData;

  useEffect(() => {
    if (error || syncError) {
      setErrors(true);
    }
  }, [error, syncError]);

  return (
    <React.Fragment>
      <BattleToolbar
          initiative={getInitiative(battleData)}
          round={round}
          secondsElapsed={secondsElapsed}
          creatures={creatureCount}
          playerSession
      />
      { errors && <Errors
         errors={['Error synchronising with Dungeon Master']}
         dismissErrors={() => setErrors(false)}
       />
      }
      <div className="main-footer-wrapper">
        <main className="main">
         <h1 className="main-title main-title__short">
           D&D Battle Tracker
         </h1>
         <h2>Player Session {battleId}</h2>
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
        <Footer playerSession/>
       </div>
    </React.Fragment>
  );
}

export default PlayerApp;