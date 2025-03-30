import {
  save, load, isSaveLoadSupported,
} from './SaveManager';
import FileSystem from '../util/fileSystem';
import defaultState from '../../test/fixtures/battle';

jest.mock('../util/fileSystem');

beforeEach(() => {
  FileSystem.save.mockReset();
  FileSystem.load.mockReset();
  FileSystem.isSaveSupported.mockReset();
});

describe('save', () => {
  it('saves the current app state removing aria announcements and errors', () => {
    save(defaultState);
    const { calls } = FileSystem.save.mock;
    expect(calls.length).toBe(1);
    const fileContents = JSON.parse(calls[0][2]);
    const {
      ariaAnnouncements, errors, createCreatureErrors, ...expectedFileContents
    } = defaultState;
    expect(fileContents).toEqual(expectedFileContents);
  });

  it('saves the file in JSON format', () => {
    save(defaultState);
    const { calls } = FileSystem.save.mock;
    expect(calls[0][1]).toBe('application/json');
  });

  it('includes the current time in the file name', () => {
    save(defaultState);
    const { calls } = FileSystem.save.mock;
    const fileNameRegex = /dnd_battle_tracker_(\d|\d\d)_(\d|\d\d)_\d\d\d\d_(\d|\d\d)_(\d|\d\d)_(\d|\d\d)\.json/g;
    const fileName = calls[0][0];

    expect(fileName.match(fileNameRegex).length).toBe(1);
  });

  it('sets an aria announcement in the app state', () => {
    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['battle saved'],
    };
    expect(save(defaultState)).toEqual(expectedState);
  });
});

describe('load', () => {
  const file = {
    name: 'fileName',
  };

  it('parses the contents of a file as JSON and adds an aria announcement', async () => {
    const { ariaAnnouncements, ...fileContents } = defaultState;
    FileSystem.load.mockResolvedValue(JSON.stringify(fileContents));

    const loadedFileContents = await load(defaultState, file);

    const { calls } = FileSystem.load.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(file);
    const expectedFileContents = {
      ...defaultState,
      ariaAnnouncements: ['battle loaded'],
    };
    expect(loadedFileContents).toEqual(expectedFileContents);
  });

  it('keeps battle sharing data of current session', async () => {
    const { ariaAnnouncements, ...fileContents } = defaultState;
    FileSystem.load.mockResolvedValue(JSON.stringify(fileContents));

    const state = {
      ...defaultState,
      battleId: '123',
      battleCreated: true,
      shareEnabled: true,
    };

    const loadedFileContents = await load(state, file);

    const { calls } = FileSystem.load.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(file);
    const expectedFileContents = {
      ...state,
      ariaAnnouncements: ['battle loaded'],
    };
    expect(loadedFileContents).toEqual(expectedFileContents);
  });

  it('resets errors on load', async () => {
    const state = {
      ...defaultState,
      errors: ['an error'],
      createCreatureErrors: { some: 'error' },
    };
    const {
      ariaAnnouncements, createCreatureErrors, errors, ...fileContents
    } = defaultState;
    FileSystem.load.mockResolvedValue(JSON.stringify(fileContents));

    const loadedFileContents = await load(state, file);

    const { calls } = FileSystem.load.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(file);
    const expectedFileContents = {
      ...defaultState,
      ariaAnnouncements: ['battle loaded'],
    };
    expect(loadedFileContents).toEqual(expectedFileContents);
  });

  it('sets an error in app state if the loaded battle is from a previous major version', async () => {
    expect.assertions(1);

    const { ariaAnnouncements, ...state } = defaultState;
    const fileContents = { ...state, battleTrackerVersion: '0.1.0' };
    FileSystem.load.mockResolvedValue(JSON.stringify(fileContents));

    const results = await load(defaultState, file);

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['failed to load battle'],
      errors: ['Failed to load battle. The file "fileName" was saved from version 0.1.0 of the battle tracker and is not compatible with the current version, 5.0.0.'],
    };

    expect(results).toEqual(expectedState);
  });

  it('sets an error in app state if the loaded battle is from a subsequent major version', async () => {
    expect.assertions(1);

    const { ariaAnnouncements, ...state } = defaultState;
    const fileContents = { ...state, battleTrackerVersion: '2.0.0' };
    FileSystem.load.mockResolvedValue(JSON.stringify(fileContents));

    const results = await load(defaultState, file);

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['failed to load battle'],
      errors: ['Failed to load battle. The file "fileName" was saved from version 2.0.0 of the battle tracker and is not compatible with the current version, 5.0.0.'],
    };

    expect(results).toEqual(expectedState);
  });

  it('sets an error in app state if the loaded battle is from an unknown version', async () => {
    expect.assertions(1);

    const { ariaAnnouncements, ...state } = defaultState;
    const fileContents = { ...state, battleTrackerVersion: undefined };
    FileSystem.load.mockResolvedValue(JSON.stringify(fileContents));

    const results = await load(defaultState, file);

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['failed to load battle'],
      errors: ['Failed to load battle. The file "fileName" was saved from a different version of the battle tracker and is not compatible with the current version, 5.0.0.'],
    };

    expect(results).toEqual(expectedState);
  });

  it('sets an error in app state if the loaded file contents are not JSON', async () => {
    expect.assertions(1);

    const fileContents = 'not JSON';
    FileSystem.load.mockReturnValue(new Promise((resolve) => {
      resolve(fileContents);
    }));

    const results = await load(defaultState, file);

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['failed to load battle'],
      errors: ['Failed to load battle. The file "fileName" was invalid.'],
    };

    expect(results).toEqual(expectedState);
  });
});

describe('isSaveLoadSupported', () => {
  it('returns true if saving a file is supported', () => {
    FileSystem.isSaveSupported.mockReturnValue(true);
    expect(isSaveLoadSupported()).toBe(true);
  });

  it('returns false if saving a file is not supported', () => {
    FileSystem.isSaveSupported.mockReturnValue(false);
    expect(isSaveLoadSupported()).toBe(false);
  });
});
