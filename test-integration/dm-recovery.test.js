import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { graphql, HttpResponse } from 'msw';
import DmApp from './page-object-models/dmApp';
import msw from './mocks/server';
import defaultState from '../test/fixtures/battle';
import {
  createDmRecoveryKey,
  encryptDmRecovery,
} from '../src/state/DmRecoveryManager';

describe('DM recovery', () => {
  test('recovers private state and creates a fresh player session', async () => {
    const recoveryId = 'dm-recovery-battle-id';
    const oldPlayerBattleId = 'expired-player-battle-id';
    const key = createDmRecoveryKey();
    expect(key).toBeDefined();

    const state = {
      ...defaultState,
      battleId: oldPlayerBattleId,
      battleCreated: true,
      shareEnabled: true,
      dmRecoveryId: recoveryId,
      dmRecoveryKey: key,
      dmRecoveryCreated: true,
    };
    const dmSnapshot = await encryptDmRecovery(state, key, recoveryId);

    msw.use(
      graphql.query('GET_DM_RECOVERY', ({ variables }) => {
        expect(variables.recoveryId).toBe(recoveryId);
        return HttpResponse.json({
          data: {
            getDndbattletracker: {
              battleId: recoveryId,
              dmSnapshot,
            },
          },
        });
      }),
    );

    new DmApp({ recoveryId, key });

    await waitFor(() => {
      const savedState = JSON.parse(window.localStorage.getItem('battle'));
      expect(savedState.battleId).toBe('random-battle-id');
      expect(savedState.battleId).not.toBe(oldPlayerBattleId);
      expect(savedState.dmRecoveryId).toBe(recoveryId);
      expect(savedState.dmRecoveryKey).toBe(key);
      expect(savedState.dmRecoveryCreated).toBe(true);
      expect(savedState.shareEnabled).toBe(true);
      expect(savedState.battleCreated).toBe(true);
      expect(savedState.creatures[1].armorClass).toBe(15);
      expect(savedState.creatures[1].statBlock).toBe('https://www.dndbeyond.com/monsters/goblin');
      expect(savedState.creatures[1].initiativeRoll).toEqual({ result: 12 });
    });

    const playerLink = await screen.findByRole('link', {
      name: 'Player session random-battle-id (link copied)',
    });
    expect(playerLink).toHaveAttribute('href', 'http://localhost/?battle=random-battle-id');

    const recoveryLink = await screen.findByRole('link', { name: 'DM recovery link' });
    const recoveryUrl = new URL(recoveryLink.href);
    const recovery = new URLSearchParams(recoveryUrl.hash.replace(/^#/, ''));

    expect(recoveryLink).toBeVisible();
    expect(recovery.get('dm')).toBe(recoveryId);
    expect(recovery.get('key')).toBe(key);
  });

  test('can leave online mode after recovering a battle', async () => {
    const recoveryId = 'dm-recovery-battle-id';
    const key = createDmRecoveryKey();
    expect(key).toBeDefined();
    const dmSnapshot = await encryptDmRecovery({
      ...defaultState,
      battleId: 'old-player-battle',
      battleCreated: true,
      shareEnabled: true,
      dmRecoveryId: recoveryId,
      dmRecoveryKey: key,
      dmRecoveryCreated: true,
    }, key, recoveryId);

    msw.use(
      graphql.query('GET_DM_RECOVERY', () => HttpResponse.json({
        data: {
          getDndbattletracker: {
            battleId: recoveryId,
            dmSnapshot,
          },
        },
      })),
    );

    const dmApp = new DmApp({ recoveryId, key });
    await screen.findByRole('link', { name: 'DM recovery link' });

    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Unshare battle');

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: 'DM recovery link' })).toBeNull();
    });
  });

  test('keeps the local battle and shows an error for an expired recovery link', async () => {
    window.localStorage.setItem('battle', JSON.stringify({
      ...defaultState,
      shareEnabled: false,
      battleId: undefined,
      battleCreated: false,
    }));

    msw.use(
      graphql.query('GET_DM_RECOVERY', () => HttpResponse.json({
        data: {
          getDndbattletracker: null,
        },
      })),
    );

    new DmApp({
      recoveryId: 'dm-expired-recovery',
      key: createDmRecoveryKey(),
    });

    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent('Could not recover the DM battle. The recovery link may be invalid or expired.');

    const savedState = JSON.parse(window.localStorage.getItem('battle'));
    expect(savedState.creatures).toEqual(defaultState.creatures);
    expect(savedState.battleId).toBeUndefined();
    expect(savedState.shareEnabled).toBe(false);
  });
});
