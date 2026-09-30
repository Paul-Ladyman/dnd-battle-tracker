import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_BATTLE,
  GET_DM_RECOVERY,
  UPDATE_BATTLE,
} from '../../graphql/operations';
import {
  share,
  shareRecovery,
  handleShareError,
  handleRecoveryError,
} from '../../state/SyncManager';
import {
  decryptDmRecovery,
  restoreDmRecovery,
} from '../../state/DmRecoveryManager';
import { updateErrors } from '../../state/ErrorManager';
import DungeonMasterApp from './DungeonMasterApp';
import Loading from './Loading';

const recoveryErrorMessage = 'Could not recover the DM battle. The recovery link may be invalid or expired.';
const recoveryRetryDelay = 200;
const maxRecoveryRetries = 2;

export default function SharedDungeonMasterApp({
  state,
  setState,
  recovery,
  onRecoveryResolved,
}) {
  const [recoveryResolved, setRecoveryResolved] = useState(!recovery);
  const [recoveryRetries, setRecoveryRetries] = useState(0);
  const [createBattleMutation, { error: createError }] = useMutation(CREATE_BATTLE);
  const [updateBattleMutation, { error: updateError }] = useMutation(UPDATE_BATTLE);
  const [createRecoveryMutation, { error: createRecoveryError }] = useMutation(CREATE_BATTLE);
  const [updateRecoveryMutation, { error: updateRecoveryError }] = useMutation(UPDATE_BATTLE);
  const {
    loading: recoveryLoading,
    data: recoveryData,
    error: recoveryError,
    refetch: refetchRecovery,
  } = useQuery(GET_DM_RECOVERY, {
    skip: !recovery || recoveryResolved,
    variables: recovery ? { recoveryId: recovery.recoveryId } : undefined,
    fetchPolicy: 'network-only',
  });

  const shareBattle = (shareState) => share(
    shareState,
    createBattleMutation,
    updateBattleMutation,
    createRecoveryMutation,
    updateRecoveryMutation,
  );

  const shareDmRecovery = (shareState) => shareRecovery(
    shareState,
    createRecoveryMutation,
    updateRecoveryMutation,
  );

  useEffect(() => {
    if (!recovery) {
      setState((prevState) => shareBattle(prevState));
    }
  }, []);

  useEffect(() => {
    setState((prevState) => handleShareError(prevState, createError, updateError));
  }, [createError, updateError]);

  useEffect(() => {
    if (!createRecoveryError && !updateRecoveryError) return;
    setState((prevState) => handleRecoveryError(
      prevState,
      createRecoveryError,
      updateRecoveryError,
    ));
  }, [createRecoveryError, updateRecoveryError]);

  useEffect(() => {
    if (!recovery || recoveryResolved || recoveryLoading) return undefined;

    let cancelled = false;
    const dmSnapshot = recoveryData?.getDndbattletracker?.dmSnapshot;

    const resolveRecovery = () => {
      setRecoveryResolved(true);
      onRecoveryResolved();
    };

    if (!dmSnapshot && recoveryRetries < maxRecoveryRetries) {
      const retry = setTimeout(() => {
        setRecoveryRetries((previousRetries) => previousRetries + 1);
        refetchRecovery().catch(() => undefined);
      }, recoveryRetryDelay);

      return () => clearTimeout(retry);
    }

    if (recoveryError || !dmSnapshot) {
      setState((prevState) => updateErrors(prevState, recoveryErrorMessage));
      resolveRecovery();
      return undefined;
    }

    decryptDmRecovery(dmSnapshot, recovery.key, recovery.recoveryId)
      .then((recoveredState) => {
        if (cancelled) return;

        setState((prevState) => {
          const restoredState = restoreDmRecovery(
            prevState,
            recoveredState,
            recovery,
          );
          return shareBattle(restoredState);
        });
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}`,
        );
        resolveRecovery();
      })
      .catch(() => {
        if (cancelled) return;
        setState((prevState) => updateErrors(prevState, recoveryErrorMessage));
        resolveRecovery();
      });

    return () => {
      cancelled = true;
    };
  }, [
    recovery,
    recoveryResolved,
    recoveryLoading,
    recoveryData,
    recoveryError,
    recoveryRetries,
  ]);

  if (recovery && !recoveryResolved) {
    return <Loading />;
  }

  return (
    <DungeonMasterApp
      state={state}
      setState={setState}
      shareBattle={shareBattle}
      shareRecovery={shareDmRecovery}
    />
  );
}
