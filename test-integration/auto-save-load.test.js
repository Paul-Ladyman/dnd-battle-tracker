/* eslint-disable no-new */
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { graphql, HttpResponse } from 'msw';
import msw from './mocks/server';
import DmApp from './page-object-models/dmApp';
import now from '../src/util/date';
import defaultState from '../test/fixtures/battle';

jest.mock('../src/util/date');

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Auto save/load', () => {
  it('saves a battle and loads it when a new session starts', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    dmApp.close();
    new DmApp();
    await DmApp.assertCreatureVisible('goblin');
  });

  it('saves the battle every time it is modified', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    dmApp.close();
    new DmApp();
    await DmApp.assertCreatureVisible('goblin 1');
    await DmApp.assertCreatureVisible('goblin 2');
  });

  it('does not load a battle saved by a previous major version of the application', async () => {
    global.localStorage.setItem('battle', JSON.stringify({
      ...defaultState,
      shareEnabled: false,
      battleTrackerVersion: '0.1.0',
    }));
    const dmApp = new DmApp();
    await dmApp.assertCreatureListEmpty();
    await DmApp.assertError('Cannot autoload battle. The saved battle was from version 0.1.0 of the battle tracker and is not compatible with the current version');
  });

  it('allows a previously shared battle to be continued after loading', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    dmApp.close();
    new DmApp();
    const playerSessionLink = await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    expect(playerSessionLink).toBeVisible();
  });

  it('allows a previously shared battle that has been reset to be continued after loading', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickYes();
    await dmApp.assertCreatureListEmpty();
    dmApp.close();
    new DmApp();
    const playerSessionLink = await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    expect(playerSessionLink).toBeVisible();
  });

  it('resets the the saved state when a battle is fully reset', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickYes();
    await dmApp.assertCreatureListEmpty();
    dmApp.close();
    const dmApp2 = new DmApp();
    await dmApp2.assertCreatureListEmpty();
  });

  it('does not reset the the saved state when a battle is reset with locked creatures', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.menuTool.lockCreature('goblin');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickYes();
    dmApp.close();
    new DmApp();
    await DmApp.assertCreatureVisible('goblin');
  });

  it('unshares a battle if there was an error sharing after loading', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    dmApp.close();
    msw.use(
      graphql.mutation('UPDATE_BATTLE', () => HttpResponse.json({
        errors: [
          {
            message: 'Update error',
          },
        ],
      })),
    );
    try {
      new DmApp();
    } catch {
      await DmApp.assertError('Error rejoining previously shared battle. Try resharing the battle.');
    }
  });

  it('unshares a battle if it was shared more than 12 hours ago', async () => {
    const nowMs = Date.now();
    now.mockReturnValue(nowMs);
    global.localStorage.setItem('battle', JSON.stringify({
      ...defaultState,
      sharedTimestamp: nowMs - 12 * 60 * 60 * 1000,
    }));
    const dmApp = new DmApp();
    await waitFor(() => dmApp.assertCreatureListLength(3));
    const playerSessionLink = screen.queryByRole('link', { name: 'Player session 123 (link copied)' });
    expect(playerSessionLink).toBeNull();
  });

  it('does not unshare a battle that was initially shared more than 12 hours ago but has been reshared since', async () => {
    const nowMs = Date.now();
    now.mockReturnValue(nowMs);
    global.localStorage.setItem('battle', JSON.stringify({
      ...defaultState,
      sharedTimestamp: nowMs - 12 * 60 * 60 * 1000,
    }));
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    dmApp.close();
    new DmApp();
    const playerSessionLink = await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    expect(playerSessionLink).toBeVisible();
  });

  it('does not save errors', async () => {
    global.localStorage.setItem('battle', JSON.stringify({
      ...defaultState,
      shareEnabled: false,
      errors: ['An error'],
    }));
    const dmApp = new DmApp();
    dmApp.assertNoErrors();
  });

  it('shows an error if loading a battle fails', async () => {
    jest.spyOn(Storage.prototype, 'getItem');
    global.localStorage.getItem.mockImplementation(() => {
      throw new Error('oops');
    });
    new DmApp();
    await DmApp.assertError('Cannot autoload battle. An unexpected error occured');
  });

  it('shows an error if the loaded battle was invalid', async () => {
    global.localStorage.setItem('battle', 'invalid');
    new DmApp();
    await DmApp.assertError('Cannot autoload battle. An unexpected error occured');
  });

  it('shows an error if saving a battle fails', async () => {
    jest.spyOn(Storage.prototype, 'setItem');
    global.localStorage.setItem.mockImplementation(() => {
      throw new Error('oops');
    });
    new DmApp();
    await DmApp.assertError('An error occurred while autosaving the battle. Autosaving will be disabled until the page is reloaded.');
  });

  it('stops auto-saving after an error', async () => {
    jest.spyOn(Storage.prototype, 'setItem');
    global.localStorage.setItem.mockImplementation(() => {
      throw new Error('oops');
    });
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.createCreatureForm.addCreature('goblin');
    const saves = global.localStorage.setItem.mock.calls.filter((call) => call[0] === 'battle');
    expect(saves).toHaveLength(1);
  });

  it('will warn the user about losing data when they close the app if there was an error saving', async () => {
    jest.spyOn(Storage.prototype, 'setItem');
    global.localStorage.setItem.mockImplementation(() => {
      throw new Error('oops');
    });
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    expect(window.onbeforeunload()).toBe(true);
  });
});
