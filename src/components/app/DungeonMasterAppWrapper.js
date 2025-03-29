import React, {
  useState,
  Suspense,
  lazy,
  useEffect,
  useMemo,
} from 'react';
import DungeonMasterApp from './DungeonMasterApp';
import {
  newBattleState,
} from '../../state/BattleManager';
import Loading from './Loading';
import OfflineApolloProvider from '../../graphql/OfflineApolloProvider';
import useAutoSaveLoad from './useAutoSaveLoad';
import { autoLoad } from '../../state/AppManager';
import { addError } from '../../state/ErrorManager';

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

  useEffect(() => {
    const { creatures, autoSaveError } = state;
    if (!autoSaveError) {
      try {
        if (creatures.length > 0) {
          console.log('>>> SAVE BATTLE', name, window.localStorage.setItem);
          window.localStorage.setItem('battle', JSON.stringify(state));
        } else {
          console.log('>>> RESET BATTLE', name);
          window.localStorage.removeItem('battle');
        }
      } catch {
        const errors = addError(state, 'An error occurred while autosaving the battle. Autosaving will be disabled until the page is reloaded.');
        setState({ ...state, errors, autoSaveError: true });
        window.onbeforeunload = () => true;
      }
    }
  }, [state]);

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
