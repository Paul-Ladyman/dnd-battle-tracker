import React, { useState, useEffect } from 'react';
import DungeonMasterApp from './DungeonMasterApp';
import SharedDungeonMasterApp from './SharedDungeonMasterApp';
import getApolloClient from '../../graphql/apolloClient';
import { ApolloProvider } from '@apollo/client';
import {
  newBattleState,
} from '../../state/BattleManager';

export default function DungeonMasterAppWrapper() {
  const [apolloClient, setApolloClient] = useState(undefined);
  const [state, setState] = useState(newBattleState);

  useEffect(() => {
    async function initApolloClient() {
      const client = await getApolloClient();
      setApolloClient(client);
    }

    if (state.shareEnabled && !apolloClient) {
      initApolloClient();
    }
  }, [state.shareEnabled]);

  if (state.shareEnabled && apolloClient) {
    return (
      <ApolloProvider client={apolloClient}>
        <SharedDungeonMasterApp
          state={state}
          setState={setState}
        />
      </ApolloProvider>
    );
  }

  return (
    <DungeonMasterApp
      shareBattle={(state) => state}
      state={state}
      setState={setState}
    />
  );
}