import React, { useState, useEffect } from 'react';
import DungeonMasterApp from './DungeonMasterApp';
import SharedDungeonMasterApp from './SharedDungeonMasterApp';
import getApolloClient from '../../graphql/apolloClient';
import { ApolloProvider } from '@apollo/client';
import {
  newBattleState,
} from '../../state/BattleManager';

export default function DungeonMasterAppWrapper() {
  const [apolloInitCount, setApolloInitCount] = useState(0);
  const [apolloClient, setApolloClient] = useState(undefined);
  const [state, setState] = useState(newBattleState);

  async function initApolloClient() {
    console.log('>>> initApolloClient');
    const client = await getApolloClient();
    setApolloClient(client);
    setApolloInitCount(apolloInitCount+1);
  }

  useEffect(() => {
    if (state.shareEnabled && !apolloClient) {
      initApolloClient();
    }
  }, [state.shareEnabled]);

  useEffect(() => {
    console.log('>>> schedule use effect');
    if (apolloInitCount) {
      console.log('>>> scheduling apollo refresh');
      
      const timer = setTimeout(() => {
        console.log('>>> refreshing apollo client!');
        initApolloClient();
      }, 5000);

      return () => { console.log('>>> clearing timeout'); clearTimeout(timer)};
    }
  }, [apolloInitCount]);

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