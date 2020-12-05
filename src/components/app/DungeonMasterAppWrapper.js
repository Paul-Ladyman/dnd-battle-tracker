import React, { useState } from 'react';
import RefreshingApolloProvider from './RefreshingApolloProvider';
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
      shareBattle={(state) => state}
      state={state}
      setState={setState}
    />
  );
}