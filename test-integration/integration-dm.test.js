import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DungeonMasterAppWrapper from '../src/components/app/DungeonMasterAppWrapper';

describe('Dungeon Master App', () => {
  test('displays application title', async () => {
    render(<DungeonMasterAppWrapper />);
    const title = await screen.findByText('D&D Battle Tracker');
    expect(title).toBeVisible();
  });
});
