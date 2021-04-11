import React, { useState } from 'react';
import RefreshingApolloProvider from '../../graphql/RefreshingApolloProvider';
import PlayerApp from './PlayerApp';
import OnlinePlayerApp from './OnlinePlayerApp';

export default function PlayerAppWrapper({ battleId }) {
  const [state, setState] = useState({ rulesSearchOpened: false, ariaAnnouncements: [] });
  return (
    <RefreshingApolloProvider
      online
      OnlineView={OnlinePlayerApp}
      OfflineView={PlayerApp}
      battleId={battleId}
      state={state}
      setState={setState}
    />
  );
}
