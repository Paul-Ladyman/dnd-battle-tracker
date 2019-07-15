import { save, load } from './AppManager';
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
  ariaAnnouncements: []
};

describe('save', () => {
  it('saves the current app state removing aria announcements', () => {
    save(defaultState);
    const { calls } = FileSystem.save.mock;
    expect(calls.length).toBe(1);
    const fileContents = JSON.parse(calls[0][2]);
    const { ariaAnnouncements, ...expectedFileContents } = defaultState;
    expect(fileContents).toEqual(expectedFileContents);
  });

  it('saves the file in JSON format', () => {
    save(defaultState);
    const { calls } = FileSystem.save.mock;
    expect(calls[0][1]).toBe('application/json');
  });

  it('includes the current time in the file name', () => {
    const { calls } = FileSystem.save.mock;
    const fileNameRegex = /dnd_battle_tracker_(\d|\d\d)_(\d|\d\d)_\d\d\d\d_(\d|\d\d)_(\d|\d\d)_(\d|\d\d)\.json/g;
    const fileName = calls[0][0];

    expect(fileName.match(fileNameRegex).length).toBe(1);
  });
});

describe('load', () => {
  it('parses the contents of a file as JSON', async () => {
    const { ariaAnnouncements, ...expectedFileContents } = defaultState;
    FileSystem.load.mockReturnValue(new Promise(resolve =>
      resolve(JSON.stringify(expectedFileContents))
    ));

    const loadedFileContents = await load('fileName');

    const { calls } = FileSystem.load.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe('fileName');
    expect(loadedFileContents).toEqual(expectedFileContents);
  });
});