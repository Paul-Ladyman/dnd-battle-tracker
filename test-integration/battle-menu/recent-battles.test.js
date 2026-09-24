import {
  screen,
  within,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import DmApp from '../page-object-models/dmApp';

afterEach(() => {
  window.localStorage.clear();
});

describe('Recent battles', () => {
  it('archives battles before reset and restores an earlier battle', async () => {
    const dmApp = new DmApp();

    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickYes();
    await dmApp.assertCreatureListEmpty();

    await dmApp.createCreatureForm.addCreature('orc');
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Reset battle');
    await dmApp.alert.clickYes();
    await dmApp.assertCreatureListEmpty();

    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Recent battles');

    const dialog = await screen.findByRole('dialog', { name: 'Recent battles' });
    expect(dialog).toHaveTextContent('orc');
    expect(dialog).toHaveTextContent('goblin');

    const restoreButtons = within(dialog).getAllByRole('button', {
      name: /Restore battle with/,
    });
    expect(restoreButtons).toHaveLength(2);

    await dmApp.user.click(restoreButtons[1]);
    await DmApp.assertCreatureVisible('goblin');
  });
});
