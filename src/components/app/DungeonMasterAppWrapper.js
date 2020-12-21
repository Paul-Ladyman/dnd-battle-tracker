import React, { useState } from 'react';
import RefreshingApolloProvider from '../../graphql/RefreshingApolloProvider';
import DungeonMasterApp from './DungeonMasterApp';
import SharedDungeonMasterApp from './SharedDungeonMasterApp';
import {
  newBattleState,
} from '../../state/BattleManager';

export default function DungeonMasterAppWrapper() {
  const [state, setState] = useState(newBattleState);

  return (
    <RefreshingApolloProvider
      online={state.shareEnabled}
      OnlineView={SharedDungeonMasterApp}
      OfflineView={DungeonMasterApp}
      shareBattle={(sharedState) => sharedState}
      state={state}
      setState={setState}
    />
  );
}
