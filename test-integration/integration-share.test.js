import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DungeonMasterAppWrapper from '../src/components/app/DungeonMasterAppWrapper';

jest.mock('@aws-sdk/client-cognito-identity');

describe('Battle Share', () => {
  test('displays a link to the player app', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const optionsMenu = await screen.findByRole('button', { name: 'Options Menu' });
    await user.click(optionsMenu);
    const enableShare = await screen.findByRole('button', { name: 'Enable share' });
    await user.click(enableShare);

    // console.log(container.textContent);

    // const playerSessionLink = await screen.findByText(/Player session link/);
    // expect(playerSessionLink).toBeVisible();
  });
});
