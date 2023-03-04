import { rest } from 'msw';
import DmApp from './page-object-models/dmApp';
import CreateCreatureForm from './page-object-models/createCreatureForm';
import msw from './mocks/server';
import random from '../src/util/random';

jest.mock('../src/util/random');

beforeEach(() => {
  jest.resetAllMocks();
  random.mockReturnValue(0.999999);
});

describe('Create creature using SRD', () => {
  it("uses the creature's stats when it is selected", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.selectSrdCreature('Goblin');
    await dmApp.createCreatureForm.assertName('Goblin');
    await dmApp.createCreatureForm.assertHp('7');
    await dmApp.createCreatureForm.assertInitiative('d20+2');
  });

  it("sets initiative to d20 if a creature's dexterity modifier is 0", async () => {
    msw.use(
      rest.get('https://www.dnd5eapi.co/api/monsters/goblin', (req, res, ctx) => res(
        ctx.json({
          index: 'goblin',
          name: 'Goblin',
          dexterity: 10,
        }),
      )),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.selectSrdCreature('Goblin');
    await dmApp.createCreatureForm.assertInitiative('d20');
  });

  it("sets initiative to a well-formed dice notation if a creature's dexterity modifier is a negative", async () => {
    msw.use(
      rest.get('https://www.dnd5eapi.co/api/monsters/goblin', (req, res, ctx) => res(
        ctx.json({
          index: 'goblin',
          name: 'Goblin',
          dexterity: 1,
        }),
      )),
    );
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.selectSrdCreature('Goblin');
    await dmApp.createCreatureForm.assertInitiative('d20-5');
  });

  it('allows a creature to be selected by keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.selectSrdCreatureByKeyboard('Goblin');
    await dmApp.createCreatureForm.assertName('Goblin');
    await dmApp.createCreatureForm.assertHp('7');
    await dmApp.createCreatureForm.assertInitiative('d20+2');
  });

  it('adds a creature from the search results', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addSrdCreature('Goblin');
    await DmApp.assertCreatureVisible('Goblin', '7');
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

  it("does not set initiative if a creature's dexterity it is not specified", async () => {
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

  it("allows a creature's initiative to be specified as dice notation", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreature('goblin 2', '1d20+1');
    await DmApp.assertCreatureList(['goblin 2', 'goblin 1']);
  });

  it('creatures without initiative are added at the bottom of the initiative order', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreature('goblin 2', '2');
    await dmApp.createCreatureForm.addCreature('goblin 3');
    await DmApp.assertCreatureList(['goblin 2', 'goblin 1', 'goblin 3']);
  });

  it('shows an error when the creature initiative is invalid', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', 'initiative');
    await DmApp.assertError('Failed to create creature. Create creature form is invalid.');
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

  it('adds the same dice notation initiative to each multiplied creature', async () => {
    random
      .mockReturnValueOnce(0.999999)
      .mockReturnValueOnce(0);
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '5');
    await dmApp.createCreatureForm.addCreature('owlbear', '1d20', null, '2');
    await DmApp.assertCreatureList(['owlbear #1', 'owlbear #2', 'goblin']);
  });

  it("allows each creature's initiative to be rolled separately in a group", async () => {
    random
      .mockReturnValueOnce(0.999999)
      .mockReturnValueOnce(0);
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '5');
    await dmApp.createCreatureForm.addCreature('owlbear', '1d20', null, '2', true);
    await DmApp.assertCreatureList(['owlbear #1', 'goblin', 'owlbear #2']);
  });

  it('returns to rolling initiative for the group when a creature is added', async () => {
    random
      .mockReturnValueOnce(0.999999)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.999999)
      .mockReturnValueOnce(0);
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1d20', null, '2', true);
    await dmApp.createCreatureForm.addCreature('owlbear', '1d20', null, '2');
    await DmApp.assertCreatureList(['goblin #1', 'owlbear #1', 'owlbear #2', 'goblin #2']);
  });

  it('allows the initiative rolling strategy to be toggled', async () => {
    random
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.999999);
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.setRollInitiativePerCreature();
    await dmApp.createCreatureForm.setRollInitiativeAsGroup();
    await dmApp.createCreatureForm.addCreature('goblin', '1d20', null, '2');
    await DmApp.assertCreatureList(['goblin #1', 'goblin #2']);
  });

  it('selecting roll initiative per creature with a numerical initiative does not change initiative order', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.setRollInitiativePerCreature();
    await dmApp.createCreatureForm.addCreature('goblin', '1', null, '5');
    await DmApp.assertCreatureList(['goblin #1', 'goblin #2', 'goblin #3', 'goblin #4', 'goblin #5']);
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
