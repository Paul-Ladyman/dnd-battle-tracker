import '@testing-library/jest-dom';
import DmApp from './page-object-models/dmApp';

beforeAll(() => {
  window.FLAG_creatureToolbar = true;
});

describe('Creature toolbar', () => {
  test('a creature has a toolbar', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertToolbarVisible('goblin');
  });

  it('contains the creature menu button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertButtonVisible('goblin', 'Creature Menu');
  });

  it('contains the kill creature button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertButtonVisible('goblin', 'Kill/Make unconscious');
  });

  it('contains the initiative button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertButtonVisible('goblin', 'Initiative');
  });

  it('contains the conditions button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertButtonVisible('goblin', 'Conditions');
  });

  it('contains the notes button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertButtonVisible('goblin', 'Notes');
  });

  it('contains the HP button', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.assertButtonVisible('goblin', 'HP');
  });
});

describe('Creature toolbar navigation', () => {
  it('allows the buttons to be navigated forwards with the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.navigate('goblin', 2);
    await dmApp.creatureToolbar.assertButtonFocused('goblin', 'Initiative');
  });
});
