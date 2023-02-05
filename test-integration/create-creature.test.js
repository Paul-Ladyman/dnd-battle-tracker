import { rest } from 'msw';
import DmApp from './page-object-models/dmApp';
import CreateCreatureForm from './page-object-models/createCreatureForm';
import rollDice from '../src/util/rollDice';
import msw from './mocks/server';

jest.mock('../src/util/rollDice');

beforeEach(() => {
  jest.resetAllMocks();
  rollDice.mockReturnValue(20);
});

describe('Creature SRD search', () => {
  it('is closed by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.assertSrdSearchClosed();
    dmApp.createCreatureForm.assertCreaturesEmpty();
  });

  it('has no creatures by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.openCreatures();
    await dmApp.createCreatureForm.assertSrdSearchOpen();
    dmApp.createCreatureForm.assertCreaturesEmpty();
  });

  it('searches for creatures by name', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.typeName('goblin');
    await dmApp.createCreatureForm.assertCreatureExists('Goblin');
    await dmApp.createCreatureForm.assertCreatureExists('Hobgoblin');
    dmApp.createCreatureForm.assertCreaturesLength(2);
  });

  it('has no creatures if the search did not match a creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.typeName('Wellby');
    dmApp.createCreatureForm.assertCreaturesEmpty();
  });

  it('has no creatures if the search returned an empty list', async () => {
    msw.use(
      rest.get('https://www.dnd5eapi.co/api/monsters', (req, res, ctx) => res(
        ctx.json({
          results: [],
        }),
      )),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.typeName('goblin');
    dmApp.createCreatureForm.assertCreaturesEmpty();
  });

  it('has no creatures if the search returned malformed JSON', async () => {
    msw.use(
      rest.get('https://www.dnd5eapi.co/api/monsters', (req, res, ctx) => res(
        ctx.json({}),
      )),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.typeName('goblin');
    dmApp.createCreatureForm.assertCreaturesEmpty();
  });

  it('has no creatures if the search returned a malformed response', async () => {
    msw.use(
      rest.get('https://www.dnd5eapi.co/api/monsters', (req, res, ctx) => res(
        ctx.body('malformed'),
      )),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.typeName('goblin');
    dmApp.createCreatureForm.assertCreaturesEmpty();
  });

  it('has no creatures if the search returned an error', async () => {
    msw.use(
      rest.get('https://www.dnd5eapi.co/api/monsters', (req, res, ctx) => res(
        ctx.status(500),
      )),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.typeName('goblin');
    dmApp.createCreatureForm.assertCreaturesEmpty();
  });

  it('allows creature list to be closed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.typeName('goblin');
    await dmApp.createCreatureForm.closeCreatures();
    await dmApp.createCreatureForm.assertSrdSearchClosed();
    dmApp.createCreatureForm.assertCreaturesEmpty();
  });

  it('allows creature list to be closed using the keyboad', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.typeName('goblin');
    await dmApp.createCreatureForm.closeCreaturesByKeyboard();
    await dmApp.createCreatureForm.assertSrdSearchClosed();
    dmApp.createCreatureForm.assertCreaturesEmpty();
  });

  it('selects the last creature when navigating up from closed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.typeName('goblin');
    await dmApp.createCreatureForm.navigateCreaturesUp();
    await dmApp.createCreatureForm.assertCreatureSelected('Hobgoblin');
  });

  it('wraps creature list when navigating up', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.typeName('goblin');
    await dmApp.createCreatureForm.navigateCreaturesDown();
    await dmApp.createCreatureForm.navigateCreaturesUp();
    await dmApp.createCreatureForm.assertCreatureNotSelected('Goblin');
    await dmApp.createCreatureForm.assertCreatureSelected('Hobgoblin');
  });

  it('wraps creature list when navigating down', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.typeName('goblin');
    await dmApp.createCreatureForm.navigateCreaturesDown();
    await dmApp.createCreatureForm.navigateCreaturesDown();
    await dmApp.createCreatureForm.navigateCreaturesDown();
    await dmApp.createCreatureForm.assertCreatureSelected('Goblin');
    await dmApp.createCreatureForm.assertCreatureNotSelected('Hobgoblin');
  });
});

describe('Create creature using SRD', () => {
  it("uses the creature's stats and rolls initiative when it is selected", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.selectSrdCreature('Goblin');
    await dmApp.createCreatureForm.assertName('Goblin');
    await dmApp.createCreatureForm.assertHp('7');
    await dmApp.createCreatureForm.assertInitiative('22');
  });

  it('allows a creature to be selected by keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.selectSrdCreatureByKeyboard('Goblin');
    await dmApp.createCreatureForm.assertName('Goblin');
    await dmApp.createCreatureForm.assertHp('7');
    await dmApp.createCreatureForm.assertInitiative('22');
  });

  it('adds a creature from the search results', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addSrdCreature('Goblin');
    await DmApp.assertCreatureVisible('Goblin', '7');
  });

  it("uses the currently selected creature's dexterity modifier to reroll initiative", async () => {
    rollDice.mockReturnValue(10);
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.selectSrdCreature('Goblin');
    await dmApp.createCreatureForm.rollInitiative();
    await dmApp.createCreatureForm.assertInitiative('12');
  });

  it("selects only a creature's name if it does not specify a URL", async () => {
    msw.use(
      rest.get('https://www.dnd5eapi.co/api/monsters', (req, res, ctx) => res(
        ctx.json({
          results: [
            { index: 'goblin', name: 'Goblin' },
          ],
        }),
      )),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.selectSrdCreature('Goblin');
    await dmApp.createCreatureForm.assertName('Goblin');
    await dmApp.createCreatureForm.assertHp('');
    await dmApp.createCreatureForm.assertInitiative('');
  });

  it("selects only a creature's name if its data is malformed", async () => {
    msw.use(
      rest.get('https://www.dnd5eapi.co/api/monsters/goblin', (req, res, ctx) => res(
        ctx.body('malformed'),
      )),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.selectSrdCreature('Goblin');
    await dmApp.createCreatureForm.assertName('Goblin');
    await dmApp.createCreatureForm.assertHp('');
    await dmApp.createCreatureForm.assertInitiative('');
  });

  it("selects only a creature's name if fetching its data returns an error", async () => {
    msw.use(
      rest.get('https://www.dnd5eapi.co/api/monsters/goblin', (req, res, ctx) => res(
        ctx.status(500),
      )),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.selectSrdCreature('Goblin');
    await dmApp.createCreatureForm.assertName('Goblin');
    await dmApp.createCreatureForm.assertHp('');
    await dmApp.createCreatureForm.assertInitiative('');
  });

  it("does not select a creature's HP if it is not specified", async () => {
    msw.use(
      rest.get('https://www.dnd5eapi.co/api/monsters/goblin', (req, res, ctx) => res(
        ctx.json({
          index: 'goblin',
          name: 'Goblin',
        }),
      )),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.selectSrdCreature('Goblin');
    await dmApp.createCreatureForm.assertName('Goblin');
    await dmApp.createCreatureForm.assertHp('');
  });

  it("does not roll initiative if a creature's dexterity it is not specified", async () => {
    msw.use(
      rest.get('https://www.dnd5eapi.co/api/monsters/goblin', (req, res, ctx) => res(
        ctx.json({
          index: 'goblin',
          name: 'Goblin',
        }),
      )),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.selectSrdCreature('Goblin');
    await dmApp.createCreatureForm.assertName('Goblin');
    await dmApp.createCreatureForm.assertInitiative('');
  });
});

describe('Create creature manually', () => {
  it('allows a creature to be searched', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.enterCreatureName('goblin');
    await CreateCreatureForm.assertCreateCreatureSearch('goblin');
  });

  it('adds a creature to the battle', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await DmApp.assertCreatureVisible('goblin');
  });

  it('shows an error when the creature name is empty', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.submitCreature();
    await DmApp.assertError('Failed to create creature. Create creature form is invalid.');
  });

  it('adds a creature with HP', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '1');
    await DmApp.assertCreatureVisible('goblin', '1');
  });

  it('shows an error when the creature HP is invalid', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '-1');
    await DmApp.assertError('Failed to create creature. Create creature form is invalid.');
  });

  it("adds creatures to the battle in the order they are submitted if they don't have initiative", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await DmApp.assertCreatureList(['goblin 1', 'goblin 2']);
  });

  it('adds creatures to the battle in initiative order', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreature('goblin 2', '2');
    await DmApp.assertCreatureList(['goblin 2', 'goblin 1']);
  });

  it("allows a creature's initiative to be rolled", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreatureWithRolledInitiative('goblin 2');
    await DmApp.assertCreatureList(['goblin 2', 'goblin 1']);
  });

  it('creatures without initiative are added at the bottom of the initiative order', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreature('goblin 2', '2');
    await dmApp.createCreatureForm.addCreature('goblin 3');
    await DmApp.assertCreatureList(['goblin 2', 'goblin 1', 'goblin 3']);
  });

  it('adds multiples of a creature to the battle', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, '2');
    await DmApp.assertCreatureList(['goblin #1', 'goblin #2']);
  });

  it('adds the same HP to each multiplied creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, '1', '2');
    await DmApp.assertCreatureVisible('goblin #1', '1');
    await DmApp.assertCreatureVisible('goblin #2', '1');
  });

  it('adds the same initiative to each multiplied creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('owlbear', '1', null);
    await dmApp.createCreatureForm.addCreature('goblin', '2', null, '2');
    await DmApp.assertCreatureList(['goblin #1', 'goblin #2', 'owlbear']);
  });

  it('adds the same rolled initiative to each multiplied creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('owlbear', '1', null);
    await dmApp.createCreatureForm.addCreatureWithRolledInitiative('goblin', null, '2');
    await DmApp.assertCreatureList(['goblin #1', 'goblin #2', 'owlbear']);
  });

  it('shows an error when the multiplier is less than 1', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, '0');
    await DmApp.assertError('Failed to create creature. Create creature form is invalid.');
  });

  it('shows an error when the multiplier is greater than 50', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', null, null, '51');
    await DmApp.assertError('Failed to create creature. Create creature form is invalid.');
  });
});
