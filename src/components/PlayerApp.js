import { useQuery, useSubscription } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { GET_BATTLE, SYNC_BATTLE } from '../graphql/operations';
import BattleToolbar from './BattleToolbar';
import Creatures from './Creatures';
import Footer from './Footer';
import Errors from './Errors';
import Title from './Title';
import { 
  newBattleState,
  getSecondsElapsed,
  getInitiative
} from '../state/BattleManager';


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

function PlayerApp({ battleId }) {
  console.log('>>> player app');
  const [errors, setErrors] = useState(false);

  const { loading: getLoading, error: getError, data: getData } = useQuery(GET_BATTLE, {
    variables: { battleId }
  });

  const { loading: syncLoading, error: syncError, data: syncData } = useSubscription(SYNC_BATTLE, {
    variables: { battleId }
  });

  const battleData = getBattleData(getLoading, getData, syncLoading, syncData);

  const secondsElapsed = getSecondsElapsed(battleData);
  const { creatureCount, round, creatures, activeCreature, focusedCreature } = battleData;

  useEffect(() => {
    if (getError || syncError) {
      setErrors(true);
    }
  }, [getError, syncError]);

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
          <Title
            battleId={battleId}
            playerSession
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
        <Footer playerSession/>
       </div>
    </React.Fragment>
  );
}

export default PlayerApp;