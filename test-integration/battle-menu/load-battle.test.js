import '@testing-library/jest-dom';
import DmApp from '../page-object-models/dmApp';
import FileSystem from '../../src/util/fileSystem';
import defaultState from '../../test/fixtures/battle';

jest.mock('../../src/util/fileSystem');

beforeEach(() => {
  jest.resetAllMocks();
  FileSystem.isSaveSupported.mockReturnValue(true);
});

describe('Load battle', () => {
  test('closes the Battle Menu', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Load battle');
    await dmApp.battleMenu.assertClosed();
  });

  test('loads the battle', async () => {
    FileSystem.load.mockResolvedValue(JSON.stringify(defaultState));
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.loadBattle();
    await DmApp.assertCreatureList(['Wellby', 'Goblin #1', 'Goblin #2']);
  });

  test('is not displayed if the browser does not support loading', async () => {
    FileSystem.isSaveSupported.mockReturnValue(false);
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.assertMenuItemNotVisible('Load battle');
  });
});
