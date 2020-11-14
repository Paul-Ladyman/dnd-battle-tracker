import { useQuery, useSubscription } from '@apollo/client';
import React from 'react';
import { GET_BATTLE, SYNC_BATTLE } from '../graphql/operations';
import BattleToolbar from './BattleToolbar';
import Footer from './Footer';
import { 
  newBattleState,
  getSecondsElapsed
} from '../state/BattleManager';


function getBattleData(queryData, subData) {
  if (subData) {
    return subData.onUpdateDndbattletracker
  }
  
  if (queryData && queryData.getDndbattletracker) {
    return queryData.getDndbattletracker
  }

  return newBattleState();
}
function PlayerApp({ battleId }) {
  const { loading, error, data } = useQuery(GET_BATTLE, {
    variables: { battleId }
  });

  const { loading: syncLoading, error: syncError, data:syncData } = useSubscription(SYNC_BATTLE, {
    variables: { battleId }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const battleData = getBattleData(data, syncData);

  const secondsElapsed = getSecondsElapsed(battleData);
  const { creatureCount, round } = battleData;

  return (
    <React.Fragment>
      <BattleToolbar
          // initiative={getInitiative(state)}
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
         {/* <Creatures
           creatures={state.creatures}
           activeCreature={state.activeCreature}
           focusedCreature={state.focusedCreature}
           setFocus={updateBattle(setFocus)}
           conditions={conditions}
           round={state.round}
           secondsElapsed={secondsElapsed}
           creatureManagement={creatureManagement}
           playerSession={playerSession}
          /> */}
        </main>
        <Footer
          playerSession
        />
       </div>
    </React.Fragment>
  );
}

export default PlayerApp;