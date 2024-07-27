import React, { useState, Suspense, lazy } from 'react';
import DungeonMasterApp from './DungeonMasterApp';
import {
  newBattleState,
} from '../../state/BattleManager';
import Loading from './Loading';
import OfflineApolloProvider from '../../graphql/OfflineApolloProvider';

const RefreshingApolloProvider = lazy(async () => {
  try {
    return await import('../../graphql/RefreshingApolloProvider');
  } catch {
    return { default: OfflineApolloProvider };
  }
});

const SharedDungeonMasterApp = lazy(async () => {
  try {
    return await import('./SharedDungeonMasterApp');
  } catch {
    return { default: DungeonMasterApp };
  }
});

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
