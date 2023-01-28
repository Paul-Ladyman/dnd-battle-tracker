import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerAppWrapper from '../src/components/app/PlayerAppWrapper';

function waitForOnline() {
  return screen.findByText('Player Session random-battle-id');
}

describe('Online Player App', () => {
  test('displays application title', async () => {
    render(<PlayerAppWrapper battleId="random-battle-id" />);
    await waitForOnline();
    const title = await screen.findByText('D&D Battle Tracker');
    expect(title).toBeVisible();
  });
});
