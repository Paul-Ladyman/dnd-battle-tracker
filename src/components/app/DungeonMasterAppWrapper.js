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
import { autoLoad, useAutoSave } from '../../state/AppManager';

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

export default function DungeonMasterAppWrapper({ name }) {
  console.log('>>> DungeonMasterAppWrapper')
  // const previousBattle = window.localStorage.getItem('battle');
  // const defaultState = previousBattle ? JSON.parse(previousBattle) : newBattleState;
  const initialState = useMemo(() => autoLoad(name, newBattleState()), []);
  const [state, setState] = useState(initialState);

  useAutoSave({
    state,
    setState,
    name,
  });

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
      name={name}
    />
  );
}
