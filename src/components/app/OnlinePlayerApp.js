import { useQuery, useSubscription } from '@apollo/client';
import React from 'react';
import { GET_BATTLE, SYNC_BATTLE } from '../../graphql/operations';
import PlayerApp from './PlayerApp';

export default function OnlinePlayerApp({ battleId, state, setState }) {
  const { loading: getLoading, error: getError, data: getData } = useQuery(GET_BATTLE, {
    variables: { battleId },
  });

  const { loading: syncLoading, error: syncError, data: syncData } = useSubscription(SYNC_BATTLE, {
    variables: { battleId },
  });

  return (
    <PlayerApp
      state={state}
      setState={setState}
      battleId={battleId}
      getLoading={getLoading}
      syncLoading={syncLoading}
      getError={getError}
      syncError={syncError}
      getData={getData}
      syncData={syncData}
    />
  );
}
