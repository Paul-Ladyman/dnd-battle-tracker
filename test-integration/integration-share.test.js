import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { nanoid } from 'nanoid';
import userEvent from '@testing-library/user-event';
import DungeonMasterAppWrapper from '../src/components/app/DungeonMasterAppWrapper';
import 'cross-fetch/polyfill';

jest.mock('nanoid');

describe('Battle Share', () => {
  test('displays a link to the player app', async () => {
    nanoid.mockReturnValue('random-battle-id');
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const optionsMenu = await screen.findByRole('button', { name: 'Options Menu' });
    await user.click(optionsMenu);
    const enableShare = await screen.findByRole('button', { name: 'Enable share' });
    await user.click(enableShare);

    const playerSessionLink = await screen.findByText('Player session link random-battle-id');
    expect(playerSessionLink).toBeVisible();
  });
});
