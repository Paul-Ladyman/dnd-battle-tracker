import DmApp from './page-object-models/dmApp';

describe('Creature note tool', () => {
  it('is closed by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await DmApp.assertCreatureNoteToolClosed('goblin');
    DmApp.assertCreatureNotesEmpty('goblin');
  });

  it('has no notes by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.openNotes('goblin');
    await DmApp.assertCreatureNoteToolOpen('goblin');
    DmApp.assertCreatureNotesEmpty('goblin');
  });

  it('allows notes to be added', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.addNote('goblin', 'note 1');
    await dmApp.addNote('goblin', 'note 2');
    await dmApp.openNotes('goblin');
    await DmApp.assertCreatureNoteExists('goblin', 'note 1');
    await DmApp.assertCreatureNoteExists('goblin', 'note 2');
    DmApp.assertCreatureNotesLength('goblin', 2);
  });

  it('allows a note to be added using the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.addNoteByKeyboard('goblin', 'note 1');
    await dmApp.openNotes('goblin');
    await DmApp.assertCreatureNoteExists('goblin', 'note 1');
  });

  it('allows notes to be closed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.addNote('goblin', 'note 1');
    await dmApp.openNotes('goblin');
    await dmApp.closeNotes('goblin');
    await DmApp.assertCreatureNoteToolClosed('goblin');
    DmApp.assertCreatureNotesEmpty('goblin');
  });

  it('allows notes to be closed using the keyboad', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.addNote('goblin', 'note 1');
    await dmApp.openNotes('goblin');
    await DmApp.closeNotesByKeyboard('goblin');
    await DmApp.assertCreatureNoteToolClosed('goblin');
    DmApp.assertCreatureNotesEmpty('goblin');
  });

  it('allows a note to be editted', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.addNote('goblin', 'note 1');
    await dmApp.addNote('goblin', 'note 2');
    await dmApp.editNote('goblin', 'note 1', ' b');
    await dmApp.openNotes('goblin');
    await DmApp.assertCreatureNoteExists('goblin', 'note 1 b');
    await DmApp.assertCreatureNoteExists('goblin', 'note 2');
    DmApp.assertCreatureNotesLength('goblin', 2);
  });

  it('allows a note to be editted using the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.addNote('goblin', 'note 1');
    await dmApp.addNote('goblin', 'note 2');
    await dmApp.editNoteByKeyboard('goblin', 'note 2', ' b');
    await dmApp.openNotes('goblin');
    await DmApp.assertCreatureNoteExists('goblin', 'note 1');
    await DmApp.assertCreatureNoteExists('goblin', 'note 2 b');
    DmApp.assertCreatureNotesLength('goblin', 2);
  });

  it('allows a note to be removed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.addNote('goblin', 'note 1');
    await dmApp.addNote('goblin', 'note 2');
    await dmApp.removeNote('goblin', 'note 1');
    await dmApp.openNotes('goblin');
    await DmApp.assertCreatureNoteExists('goblin', 'note 2');
    DmApp.assertCreatureNotesLength('goblin', 1);
  });

  it('allows a note to be removed using the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.addNote('goblin', 'note 1');
    await dmApp.addNote('goblin', 'note 2');
    await DmApp.removeNoteByKeyboard('goblin', 'note 2');
    await dmApp.openNotes('goblin');
    await DmApp.assertCreatureNoteExists('goblin', 'note 1');
    DmApp.assertCreatureNotesLength('goblin', 1);
  });

  it('allows a note to be searched', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.addNote('goblin', 'one');
    await dmApp.addNote('goblin', 'two');
    await dmApp.typeNote('goblin', 'n');
    await DmApp.assertCreatureNoteExists('goblin', 'one');
    DmApp.assertCreatureNotesLength('goblin', 1);
  });

  it('selects the last note when navigating up from a closed note tool', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.addNote('goblin', 'note 1');
    await dmApp.addNote('goblin', 'note 2');
    await DmApp.navigateNotesUp('goblin');
    await DmApp.assertCreatureNoteSelected('goblin', 'note 2');
  });

  it('wraps note list when navigating up', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.addNote('goblin', 'note 1');
    await dmApp.addNote('goblin', 'note 2');
    await DmApp.navigateNotesDown('goblin');
    await DmApp.navigateNotesUp('goblin');
    await DmApp.assertCreatureNoteNotSelected('goblin', 'note 1');
    await DmApp.assertCreatureNoteSelected('goblin', 'note 2');
  });

  it('wraps note list when navigating down', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.addNote('goblin', 'note 1');
    await dmApp.addNote('goblin', 'note 2');
    await DmApp.navigateNotesDown('goblin');
    await DmApp.navigateNotesDown('goblin');
    await DmApp.navigateNotesDown('goblin');
    await DmApp.assertCreatureNoteSelected('goblin', 'note 1');
    await DmApp.assertCreatureNoteNotSelected('goblin', 'note 2');
  });
});
