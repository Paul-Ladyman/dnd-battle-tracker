import React from 'react';
import RefreshingApolloProvider from '../../graphql/RefreshingApolloProvider';
import PlayerApp from './PlayerApp';
import OnlinePlayerApp from './OnlinePlayerApp';

export default function PlayerAppWrapper({ battleId }) {
  return (
    <RefreshingApolloProvider
      online
      OnlineView={OnlinePlayerApp}
      OfflineView={PlayerApp}
      battleId={battleId}
    />
  );
}
