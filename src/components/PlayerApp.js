import { useQuery, useSubscription } from '@apollo/client';
import React from 'react';
import { GET_BATTLE, SYNC_BATTLE } from '../graphql/operations';
import BattleToolbar from './BattleToolbar';
import Creatures from './Creatures';
import Footer from './Footer';
import { 
  newBattleState,
  getSecondsElapsed,
  getInitiative
} from '../state/BattleManager';


// TODO abstract into SyncManager
function getBattleData(queryDataLoading, queryData, subLoading, subData) {
  if (!subLoading && subData && subData.onUpdateDndbattletracker) {
    const { onUpdateDndbattletracker } = subData;
    return { ...onUpdateDndbattletracker, creatures: JSON.parse(onUpdateDndbattletracker.creatures)};
  }
  
  if (!queryDataLoading && queryData && queryData.getDndbattletracker) {
    const { getDndbattletracker } = queryData;
    return { ...getDndbattletracker, creatures: JSON.parse(getDndbattletracker.creatures) };
  }

  console.log('>>> new');

  return newBattleState();
}

function PlayerApp({ battleId }) {
  const { loading, error, data } = useQuery(GET_BATTLE, {
    variables: { battleId }
  });

  const { loading: syncLoading, error: syncError, data:syncData } = useSubscription(SYNC_BATTLE, {
    variables: { battleId }
  });

  if (error) return <p>Error :( {JSON.stringify(error)}</p>;

  const battleData = getBattleData(loading, data, syncLoading, syncData);

  const secondsElapsed = getSecondsElapsed(battleData);
  const { creatureCount, round, creatures, activeCreature, focusedCreature } = battleData;

  return (
    <React.Fragment>
      <BattleToolbar
          initiative={getInitiative(battleData)}
          round={round}
          secondsElapsed={secondsElapsed}
          creatures={creatureCount}
          playerSession
      />
      {/* { errors && <Errors */}
         {/* errors={state.errors} */}
         {/* dismissErrors={updateBattle(dismissErrors)} */}
       {/* /> */}
      {/* } */}
      {/* <div className="aria-announcements" role='region' aria-live="assertive"> */}
        {/* {state.ariaAnnouncements} */}
      {/* </div> */}
      <div className="main-footer-wrapper">
        <main className="main">
         <h1 className="main-title">
           D&D Battle Tracker
         </h1>
         <h2>Player Session {battleId}</h2>
         <Creatures
           creatures={creatures}
           activeCreature={activeCreature}
           focusedCreature={focusedCreature}
          //  setFocus={updateBattle(setFocus)}
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