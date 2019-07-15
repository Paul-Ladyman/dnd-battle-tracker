import { save, load, isSaveLoadSupported } from './AppManager';
import FileSystem from './FileSystem';

jest.mock('./FileSystem');

const defaultState = {
  creatures:[
    {
      name: 'Wellby',
      initiative: 13,
      id: 0,
      alive:true,
      conditions: [],
      notes: []
    },
    {
      name: 'Goblin',
      initiative: 12,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 1,
      alive: true,
      conditions: [],
      notes: []
    },
    {
      name: 'Goblin 2',
      initiative: 10,
      healthPoints: 10,
      maxHealthPoints: 10,
      id: 2,
      alive: true,
      conditions: [],
      notes: []
    }
  ],
  creatureIdCount: 3,
  creatureCount: 3,
  activeCreature: 1,
  focusedCreature: 1,
  round: 1,
  ariaAnnouncements: [],
  errors: []
};


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
    const { ariaAnnouncements, errors, ...expectedFileContents } = defaultState;
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
      ariaAnnouncements: ['battle saved']
    };
    expect(save(defaultState)).toEqual(expectedState);
  });
});

describe('load', () => {
  const file = {
    name: 'fileName'
  };

  it('parses the contents of a file as JSON and adds an aria announcement', async () => {
    const { ariaAnnouncements, ...fileContents } = defaultState;
    FileSystem.load.mockReturnValue(new Promise(resolve =>
      resolve(JSON.stringify(fileContents))
    ));

    const loadedFileContents = await load(file, defaultState);

    const { calls } = FileSystem.load.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(file);
    const expectedFileContents = {
      ...defaultState,
      ariaAnnouncements: ['battle loaded']
    };
    expect(loadedFileContents).toEqual(expectedFileContents);
  });

  it('resets errors on load', async () => {
    const state = {
      ...defaultState,
      errors: ['an error']
    };
    const { ariaAnnouncements, ...fileContents } = defaultState;
    FileSystem.load.mockReturnValue(new Promise(resolve =>
      resolve(JSON.stringify(fileContents))
    ));

    const loadedFileContents = await load(file, state);

    const { calls } = FileSystem.load.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(file);
    const expectedFileContents = {
      ...defaultState,
      ariaAnnouncements: ['battle loaded']
    };
    expect(loadedFileContents).toEqual(expectedFileContents);
  });

  it('sets an error in app state if the loaded file contents do not meet the schema', async () => {
    expect.assertions(1);

    const fileContents = { fake: 'contents' };
    FileSystem.load.mockReturnValue(new Promise(resolve =>
      resolve(JSON.stringify(fileContents))
    ));

    const results = await load(file, defaultState);

    const expectedState = {
      ...defaultState,
      ariaAnnouncements: ['failed to load battle'],
      errors: ['Failed to load battle. The file fileName was invalid.']
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