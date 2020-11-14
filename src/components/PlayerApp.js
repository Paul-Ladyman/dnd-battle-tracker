import { useQuery, useSubscription, gql } from '@apollo/client';
import React from 'react';
import BattleToolbar from './BattleToolbar';
import Footer from './Footer';
import { newBattleState } from '../state/BattleManager';

const GET_BATTLE = gql`
query GetBattle($battleId: String!) {
  getDndbattletracker(battleId: $battleId) {
    battleId
    creatureCount
  }
}
`;

const SYNC_BATTLE = gql`
subscription SyncBattle($battleId: String!) {
  onUpdateDndbattletracker(battleId: $battleId) {
    battleId
    creatureCount
  }
}
`;

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

    console.log(loading, syncLoading, data, syncData, getBattleData(data, syncData))
  const { creatureCount } = getBattleData(data, syncData);
  return (
    <React.Fragment>
      <BattleToolbar
          // initiative={getInitiative(state)}
          // round={state.round}
          // secondsElapsed={secondsElapsed}
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
         <h1 className="main-title main-title--player-session">
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