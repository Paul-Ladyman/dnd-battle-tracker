import React, {
  useState,
  Suspense,
  lazy,
  useMemo,
} from 'react';
import DungeonMasterApp from './DungeonMasterApp';
import {
  newBattleState,
} from '../../state/BattleManager';
import Loading from './Loading';
import OfflineApolloProvider from '../../graphql/OfflineApolloProvider';
import { autoLoad, useAutoSave } from '../../state/SaveManager';

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

export default function DungeonMasterAppWrapper({ recovery }) {
  const initialState = useMemo(() => autoLoad(newBattleState()), []);
  const [state, setState] = useState(initialState);
  const [activeRecovery, setActiveRecovery] = useState(recovery);

  useAutoSave({
    state,
    setState,
  });

  const online = state.shareEnabled || Boolean(activeRecovery);

  if (online) {
    return (
      <Suspense fallback={<Loading />}>
        <RefreshingApolloProvider
          online={online}
          OnlineView={SharedDungeonMasterApp}
          OfflineView={DungeonMasterApp}
          shareBattle={(sharedState) => sharedState}
          state={state}
          setState={setState}
          recovery={activeRecovery}
          onRecoveryResolved={() => setActiveRecovery(undefined)}
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
