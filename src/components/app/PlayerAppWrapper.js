import React from 'react';
import RefreshingApolloProvider from './RefreshingApolloProvider';
import PlayerApp from './PlayerApp';
import OnlinePlayerApp from './OnlinePlayerApp';

export default function PlayerAppWrapper(props) {
  return (
    <RefreshingApolloProvider
      online={true}
      OnlineView={OnlinePlayerApp}
      OfflineView={PlayerApp}
      {...props}
    />
  );
}