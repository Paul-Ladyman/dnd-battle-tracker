import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DmApp from '../page-object-models/dmApp';

const writeTextMock = jest.fn();
const playerSessionUrl = 'http://localhost/?battle=random-battle-id';

beforeEach(() => {
  writeTextMock.mockReset();
});

describe('Battle Share', () => {
  test('displays a loading screen whilst the battle is being shared', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    const loading = screen.getByTestId('loading');
    expect(loading).toBeVisible();
  });

  test('displays a loading message whilst the player session link is being copied', async () => {
    expect.assertions(1);
    writeTextMock.mockReturnValue(new Promise(() => {}));
    window.navigator.clipboard.writeText = writeTextMock;
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    try {
      await screen.findByText(/Player session random-battle-id/);
    } catch {
      const playerSessionLink = screen.getByText('. . .');
      expect(playerSessionLink).toBeVisible();
    }
  });

  test('displays a link to the player session', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    const playerSessionLink = await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    expect(playerSessionLink).toBeVisible();
    expect(playerSessionLink).toHaveAttribute('href', playerSessionUrl);
  });

  test('allows the battle to be shared using the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItemByKeyboard('Share battle');
    const playerSessionLink = await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    expect(playerSessionLink).toBeVisible();
  });

  test('closes the Battle Menu when a battle is shared', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    await dmApp.battleMenu.assertClosed();
  });

  test('closes the Battle Menu when a battle is shared using the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItemByKeyboard('Share battle');
    await dmApp.battleMenu.assertClosed();
  });

  test('allows the battle to be unshared', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Unshare battle');
    const playerSessionLink = await screen.queryByRole('link', { name: 'Player session random-battle-id (link copied)' });
    expect(playerSessionLink).toBeNull();
  });

  test('copies the player session link to the clipboard', async () => {
    writeTextMock.mockResolvedValue();
    window.navigator.clipboard.writeText = writeTextMock;
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith(playerSessionUrl);
  });

  test('still displays the player session link if the clipboard is not available', async () => {
    const dmApp = new DmApp();
    delete window.navigator.clipboard;
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    const playerSessionLink = await screen.findByRole('link', { name: 'Player session random-battle-id' });
    expect(playerSessionLink).toBeVisible();
    expect(playerSessionLink).toHaveAttribute('href', playerSessionUrl);
  });

  test('still displays the player session link if copying it fails', async () => {
    const dmApp = new DmApp();
    writeTextMock.mockRejectedValue('clipboard error');
    window.navigator.clipboard.writeText = writeTextMock;
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Share battle');
    await waitFor(() => expect(writeTextMock).toHaveBeenCalledTimes(1));
    const playerSessionLink = await screen.findByRole('link', { name: 'Player session random-battle-id' });
    expect(playerSessionLink).toBeVisible();
    expect(playerSessionLink).toHaveAttribute('href', playerSessionUrl);
  });
});
