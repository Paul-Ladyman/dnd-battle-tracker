import React, { useState } from 'react';
import DungeonMasterApp from './DungeonMasterApp';
import SharedDungeonMasterApp from './SharedDungeonMasterApp';
import PlayerApp from './PlayerApp';
import getApolloClient from '../graphql/apolloClient';
import { ApolloProvider } from '@apollo/client';
import {
  newBattleState,
} from '../state/BattleManager';

export default function App({ battleId }) {
  const [state, setState] = useState(newBattleState);

  if (battleId) {
    const apolloClient = getApolloClient();
    return (<ApolloProvider client={apolloClient}>
      <PlayerApp battleId={battleId} /> 
    </ApolloProvider>
    )
  }

  console.log(state);

  if (state.shareEnabled) {
    const apolloClient = getApolloClient();
    return (<ApolloProvider client={apolloClient}>
      <SharedDungeonMasterApp
        state={state}
        setState={setState}
      />
    </ApolloProvider>
    )
  }

  return (
    <DungeonMasterApp
      shareBattle={(state) => state}
      state={state}
      setState={setState}
    />
  );
}