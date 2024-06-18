import React, { useState, Suspense, lazy } from 'react';
import DungeonMasterApp from './DungeonMasterApp';
import {
  newBattleState,
} from '../../state/BattleManager';
import Loading from './Loading';

const RefreshingApolloProvider = lazy(() => import('../../graphql/RefreshingApolloProvider'));
const SharedDungeonMasterApp = lazy(() => import('./SharedDungeonMasterApp'));

export default function DungeonMasterAppWrapper() {
  const [state, setState] = useState(newBattleState);

  if (state.shareEnabled) {
    return (
      <Suspense fallback={<Loading />}>
        <RefreshingApolloProvider
          online={state.shareEnabled}
          OnlineView={SharedDungeonMasterApp}
          OfflineView={DungeonMasterApp}
          shareBattle={(sharedState) => sharedState}
          state={state}
          setState={setState}
        />
      </Suspense>
    );
  }

  return (
    <DungeonMasterApp
      shareBattle={(sharedState) => sharedState}
      state={state}
      setState={setState}
    />
  );
}
