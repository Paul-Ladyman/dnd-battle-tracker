import {
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import DmApp from './page-object-models/dmApp';

describe('navigation bar', () => {
  test('allows the user to change the current view to DM Tips', async () => {
    const dmApp = new DmApp();
    await dmApp.navigation.navigateTo('DM Tips');
    const text = await screen.findByText('Dungeon Master Tips');
    expect(text).toBeVisible();
  });

  test('allows the user to change the view back to the Initiative view', async () => {
    const dmApp = new DmApp();
    await dmApp.navigation.navigateTo('DM Tips');
    await dmApp.navigation.navigateTo('Initiative');
    const text = await screen.findByText(/D&D Battle Tracker is an initiative and combat tracker tool/);
    expect(text).toBeVisible();
  });
});
