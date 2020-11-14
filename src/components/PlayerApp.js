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
  if (error) return <p>Error :( {JSON.stringify(error)}</p>;

  const battleData = getBattleData(data, syncData);
  const state = { ...battleData, creatures: JSON.parse(battleData.creatures) };

  const secondsElapsed = getSecondsElapsed(state);
  const { creatureCount, round, creatures, activeCreature, focusedCreature } = state;

  return (
    <React.Fragment>
      <BattleToolbar
          initiative={getInitiative(state)}
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