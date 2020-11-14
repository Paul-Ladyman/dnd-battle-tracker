import { useQuery, useSubscription, gql } from '@apollo/client';
import React from 'react';

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


function PlayerSessionApp({ battleId }) {
  const { loading, error, data } = useQuery(GET_BATTLE, {
    variables: { battleId }
  });

  const { loading: syncLoading, error: syncError, data:syncData } = useSubscription(SYNC_BATTLE, {
    variables: { battleId }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const battleData = syncLoading ? data : syncData;
  return (
    <div><h2>BATTLE {battleId}</h2>
      {JSON.stringify(battleData)}
      { syncError && <p>error...{JSON.stringify(syncError)}</p>}
    </div>
  );
}

export default PlayerSessionApp;