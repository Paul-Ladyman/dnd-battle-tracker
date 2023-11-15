import '@testing-library/jest-dom';
import DmApp from '../page-object-models/dmApp';
import FileSystem from '../../src/util/fileSystem';

jest.mock('../../src/util/fileSystem');

beforeEach(() => {
  jest.resetAllMocks();
  FileSystem.isSaveSupported.mockReturnValue(true);
});

describe('Save battle', () => {
  test('closes the Battle Menu', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Save battle');
    await dmApp.battleMenu.assertClosed();
  });

  test('saves the battle', async () => {
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.selectMenuItem('Save battle');
    expect(FileSystem.save).toHaveBeenCalled();
  });

  test('is not displayed if the browser does not support saving', async () => {
    FileSystem.isSaveSupported.mockReturnValue(false);
    const dmApp = new DmApp();
    await dmApp.battleMenu.toggle();
    await dmApp.battleMenu.assertMenuItemNotVisible('Save battle');
  });
});
