import DmApp from '../page-object-models/dmApp';

describe('Creature note tool', () => {
  it('is closed by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.assertCreatureNoteToolClosed('goblin');
    dmApp.creatureToolbar.assertCreatureNotesEmpty('goblin');
  });

  it('has no notes by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.openNotes('goblin');
    await dmApp.creatureToolbar.assertCreatureNoteToolOpen('goblin');
    dmApp.creatureToolbar.assertCreatureNotesEmpty('goblin');
  });

  it('allows notes to be added', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await dmApp.creatureToolbar.addNote('goblin', 'note 2');
    await dmApp.creatureToolbar.openNotes('goblin');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'note 1');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'note 2');
    dmApp.creatureToolbar.assertCreatureNotesLength('goblin', 2);
  });

  it('allows a note to be added using the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNoteByKeyboard('goblin', 'note 1');
    await dmApp.creatureToolbar.openNotes('goblin');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'note 1');
  });

  it('adds a note to the creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await DmApp.assertCreatureVisible('goblin', null, null, 'Note 1');
  });

  it('allows notes to be closed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await dmApp.creatureToolbar.openNotes('goblin');
    await dmApp.creatureToolbar.closeNotes('goblin');
    await dmApp.creatureToolbar.assertCreatureNoteToolClosed('goblin');
    dmApp.creatureToolbar.assertCreatureNotesEmpty('goblin');
  });

  it('allows notes to be closed using the keyboad', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await dmApp.creatureToolbar.openNotes('goblin');
    await dmApp.creatureToolbar.closeNotesByKeyboard('goblin');
    await dmApp.creatureToolbar.assertCreatureNoteToolClosed('goblin');
    dmApp.creatureToolbar.assertCreatureNotesEmpty('goblin');
  });

  it('allows a note to be editted', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await dmApp.creatureToolbar.addNote('goblin', 'note 2');
    await dmApp.creatureToolbar.editNote('goblin', 'note 1', ' b');
    await dmApp.creatureToolbar.openNotes('goblin');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'note 1 b');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'note 2');
    dmApp.creatureToolbar.assertCreatureNotesLength('goblin', 2);
  });

  it('updates the editted note on the creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await dmApp.creatureToolbar.editNote('goblin', 'note 1', ' b');
    await DmApp.assertCreatureVisible('goblin', null, null, 'Note 1 b');
  });

  it('allows a note to be editted using the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await dmApp.creatureToolbar.addNote('goblin', 'note 2');
    await dmApp.creatureToolbar.editNoteByKeyboard('goblin', 'note 2', ' b');
    await dmApp.creatureToolbar.openNotes('goblin');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'note 1');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'note 2 b');
    dmApp.creatureToolbar.assertCreatureNotesLength('goblin', 2);
  });

  it('allows a note to be removed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await dmApp.creatureToolbar.addNote('goblin', 'note 2');
    await dmApp.creatureToolbar.removeNote('goblin', 'note 1');
    await dmApp.creatureToolbar.openNotes('goblin');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'note 2');
    dmApp.creatureToolbar.assertCreatureNotesLength('goblin', 1);
  });

  it('allows a note to be removed using the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await dmApp.creatureToolbar.addNote('goblin', 'note 2');
    await dmApp.creatureToolbar.removeNoteByKeyboard('goblin', 'note 2');
    await dmApp.creatureToolbar.openNotes('goblin');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'note 1');
    dmApp.creatureToolbar.assertCreatureNotesLength('goblin', 1);
  });

  it('allows a note to be searched', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'one');
    await dmApp.creatureToolbar.addNote('goblin', 'two');
    await dmApp.creatureToolbar.typeNote('goblin', 'n');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'one');
    dmApp.creatureToolbar.assertCreatureNotesLength('goblin', 1);
  });

  it('ignores case of note when searching notes', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'One');
    await dmApp.creatureToolbar.typeNote('goblin', 'o');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'One');
  });

  it('ignores case of search term when searching notes', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'one');
    await dmApp.creatureToolbar.typeNote('goblin', 'O');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'one');
  });

  it('allows a note to be searched with special characters', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'one \\');
    await dmApp.creatureToolbar.typeNote('goblin', '\\');
    await dmApp.creatureToolbar.assertCreatureNoteExists('goblin', 'one \\');
  });

  it('selects the last note when navigating up from a closed note tool', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await dmApp.creatureToolbar.addNote('goblin', 'note 2');
    await dmApp.creatureToolbar.navigateNotesUp('goblin');
    await dmApp.creatureToolbar.assertCreatureNoteSelected('goblin', 'note 2');
  });

  it('wraps note list when navigating up', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await dmApp.creatureToolbar.addNote('goblin', 'note 2');
    await dmApp.creatureToolbar.navigateNotesDown('goblin');
    await dmApp.creatureToolbar.navigateNotesUp('goblin');
    await dmApp.creatureToolbar.assertCreatureNoteNotSelected('goblin', 'note 1');
    await dmApp.creatureToolbar.assertCreatureNoteSelected('goblin', 'note 2');
  });

  it('wraps note list when navigating down', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Notes');
    await dmApp.creatureToolbar.addNote('goblin', 'note 1');
    await dmApp.creatureToolbar.addNote('goblin', 'note 2');
    await dmApp.creatureToolbar.navigateNotesDown('goblin');
    await dmApp.creatureToolbar.navigateNotesDown('goblin');
    await dmApp.creatureToolbar.navigateNotesDown('goblin');
    await dmApp.creatureToolbar.assertCreatureNoteSelected('goblin', 'note 1');
    await dmApp.creatureToolbar.assertCreatureNoteNotSelected('goblin', 'note 2');
  });
});
