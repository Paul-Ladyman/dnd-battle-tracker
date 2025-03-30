import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_BATTLE, UPDATE_BATTLE } from '../../graphql/operations';
import { share, handleShareError } from '../../state/SyncManager';
import DungeonMasterApp from './DungeonMasterApp';

export default function SharedDungeonMasterApp({ state, setState }) {
  const [createBattleMutation, { error: createError }] = useMutation(CREATE_BATTLE);
  const [updateBattleMutation, { error: updateError }] = useMutation(UPDATE_BATTLE);

  const shareBattle = (shareState) => share(
    shareState,
    createBattleMutation,
    updateBattleMutation,
  );

  useEffect(() => {
    setState((prevState) => shareBattle(prevState));
  }, []);

  useEffect(() => {
    setState((prevState) => handleShareError(prevState, createError, updateError));
  }, [createError, updateError]);

  return (
    <DungeonMasterApp
      state={state}
      setState={setState}
      shareBattle={shareBattle}
    />
  );
}
