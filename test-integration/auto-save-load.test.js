/* eslint-disable no-new */
import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { graphql, HttpResponse } from 'msw';
import msw from './mocks/server';
import DmApp from './page-object-models/dmApp';
import now from '../src/util/date';
import defaultState from '../test/fixtures/battle';

jest.mock('../src/util/date');

describe('Auto save/load', () => {
  it('saves a battle and loads it when a new session starts', async () => {
    const dmApp = new DmApp('one');
    await dmApp.createCreatureForm.addCreature('goblin');
    dmApp.close();
    new DmApp('two');
    await DmApp.assertCreatureVisible('goblin');
  });

  it('saves the battle every time it is modified', async () => {
    const dmApp = new DmApp('one');
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    dmApp.close();
    new DmApp('two');
    await DmApp.assertCreatureVisible('goblin 1');
    await DmApp.assertCreatureVisible('goblin 2');
  });

  it('does not load a battle saved by a previous major version of the application', async () => {
    global.localStorage.setItem('battle', JSON.stringify({
      ...defaultState,
      shareEnabled: false,
      battleTrackerVersion: '0.1.0',
    }));
    const dmApp = new DmApp('one');
    await dmApp.assertCreatureListEmpty();
    await DmApp.assertError('Cannot autoload battle. The last autosave was from version 0.1.0 of the battle tracker and is not compatible with the current version');
  });

  it('allows a previously shared battle to be continued after loading', async () => {
    const dmApp = new DmApp('one');
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    dmApp.close();
    new DmApp('two');
    const playerSessionLink = await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    expect(playerSessionLink).toBeVisible();
  });

  it('does not save a battle without creatures', async () => {
    expect.assertions(1);
    const dmApp = new DmApp('one');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    dmApp.close();
    new DmApp('two');
    try {
      await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    } catch (e) {
      expect(e).toBeDefined();
    }
  });

  it('resets the the saved state when a battle is fully reset', async () => {
    const dmApp = new DmApp('one');
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.assertCreatureListEmpty();
    dmApp.close();
    const dmApp2 = new DmApp('two');
    await dmApp2.assertCreatureListEmpty();
  });

  it('does not reset the the saved state when a battle is reset with locked creatures', async () => {
    const dmApp = new DmApp('one');
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.menuTool.lockCreature('goblin');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    dmApp.close();
    new DmApp('two');
    await DmApp.assertCreatureVisible('goblin');
  });

  it('unshares a battle if there was an error sharing after loading', async () => {
    const dmApp = new DmApp('one');
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
      new DmApp('two');
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
    const dmApp = new DmApp('one');
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
    const dmApp = new DmApp('one');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    dmApp.close();
    new DmApp('two');
    const playerSessionLink = await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    expect(playerSessionLink).toBeVisible();
  });

  it('does not save errors', async () => {
    global.localStorage.setItem('battle', JSON.stringify({
      ...defaultState,
      shareEnabled: false,
      errors: ['An error'],
    }));
    const dmApp = new DmApp('one');
    dmApp.assertNoErrors();
  });

  // shows an error if loading a battle fails

  // shows an error if saving a battle fails

  // stops auto-saving after an error

  // adds window.onbeforeunload = () => true after an error
});
