import React from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_BATTLE, UPDATE_BATTLE } from '../graphql/operations';
import { share } from '../state/SyncManager';
import DungeonMasterApp from './DungeonMasterApp';

export default function SharedDungeonMasterApp(props) {
  console.log('sharing dm app');
  const [createBattleMutation, { error: createError }] = useMutation(CREATE_BATTLE);
  const [updateBattleMutation, { error: updateError }] = useMutation(UPDATE_BATTLE);

  const shareBattle = (shareState) =>
    share(shareState, createBattleMutation, updateBattleMutation, new Date());

  return (
    <DungeonMasterApp
      {...props}
      shareBattle={shareBattle}
    />
  );

}