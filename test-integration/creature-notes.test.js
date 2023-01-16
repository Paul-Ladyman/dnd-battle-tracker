import DmApp from './page-object-models/dmApp';
import 'cross-fetch/polyfill';

describe('Creature note tool', () => {
  it('has no notes by default', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin');
    await DmApp.assertCreatureNoteToolClosed('goblin');
    DmApp.assertCreatureNotesEmpty();
  });

  it('allows a note to be added', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin');
    await dmApp.addNote('goblin', 'note 1');
    await dmApp.assertCreatureNoteExists('goblin', 'note 1');
  });

  it('allows a note to be added using the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin');
    await dmApp.addNoteByKeyboard('goblin', 'note 1');
    await dmApp.assertCreatureNoteExists('goblin', 'note 1');
  });
});
