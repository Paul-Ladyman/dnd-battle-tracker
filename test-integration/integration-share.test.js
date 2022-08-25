import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DungeonMasterAppWrapper from '../src/components/app/DungeonMasterAppWrapper';
import 'cross-fetch/polyfill';

const writeTextMock = jest.fn();

async function shareBattle(user) {
  const optionsMenu = await screen.findByRole('button', { name: 'Options Menu' });
  await user.click(optionsMenu);
  const enableShare = await screen.findByRole('button', { name: 'Enable share' });
  await user.click(enableShare);
}

const playerSessionUrl = 'http://localhost/?battle=random-battle-id';

beforeEach(() => {
  writeTextMock.mockReset();
});

describe('Battle Share', () => {
  test('displays a loading message whilst the battle is being shared', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await shareBattle(user);
    const playerSessionLink = screen.getByText('. . .');
    expect(playerSessionLink).toBeVisible();
  });

  test('displays a loading message whilst the player session link is being copied', async () => {
    expect.assertions(1);
    const user = userEvent.setup();
    writeTextMock.mockReturnValue(new Promise(() => {}));
    window.navigator.clipboard.writeText = writeTextMock;
    render(<DungeonMasterAppWrapper />);
    await shareBattle(user);
    try {
      await screen.findByText(/Player session random-battle-id/);
    } catch {
      const playerSessionLink = screen.getByText('. . .');
      expect(playerSessionLink).toBeVisible();
    }
  });

  test('displays a link to the player session', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await shareBattle(user);
    const playerSessionLink = await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    expect(playerSessionLink).toBeVisible();
    expect(playerSessionLink).toHaveAttribute('href', playerSessionUrl);
  });

  test('copies the player session link to the clipboard', async () => {
    const user = userEvent.setup();
    writeTextMock.mockResolvedValue();
    window.navigator.clipboard.writeText = writeTextMock;
    render(<DungeonMasterAppWrapper />);
    await shareBattle(user);
    await screen.findByRole('link', { name: 'Player session random-battle-id (link copied)' });
    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith(playerSessionUrl);
  });

  test('still displays the player session link if the clipboard is not available', async () => {
    const user = userEvent.setup();
    delete window.navigator.clipboard;
    render(<DungeonMasterAppWrapper />);
    await shareBattle(user);
    const playerSessionLink = await screen.findByRole('link', { name: 'Player session random-battle-id' });
    expect(playerSessionLink).toBeVisible();
    expect(playerSessionLink).toHaveAttribute('href', playerSessionUrl);
  });

  test('still displays the player session link if copying it fails', async () => {
    const user = userEvent.setup();
    writeTextMock.mockRejectedValue('clipboard error');
    window.navigator.clipboard.writeText = writeTextMock;
    render(<DungeonMasterAppWrapper />);
    await shareBattle(user);
    await waitFor(() => expect(writeTextMock).toHaveBeenCalledTimes(1));
    const playerSessionLink = await screen.findByRole('link', { name: 'Player session random-battle-id' });
    expect(playerSessionLink).toBeVisible();
    expect(playerSessionLink).toHaveAttribute('href', playerSessionUrl);
  });
});
