import DmApp from './page-object-models/dmApp';
import rollDice from '../src/util/rollDice';

jest.mock('../src/util/rollDice');

beforeAll(() => {
  rollDice.mockReturnValue(20);
});

describe('Create creature', () => {
  it('allows a creature to be searched', async () => {
    const dmApp = new DmApp();
    await dmApp.enterCreatureName('goblin');
    await DmApp.assertCreateCreatureSearch('goblin');
  });

  it('adds a creature to the battle', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin');
    await DmApp.assertCreatureVisible('goblin');
  });

  it('shows an error when the creature name is empty', async () => {
    const dmApp = new DmApp();
    await dmApp.submitCreature();
    await DmApp.assertError('Failed to create creature. Create creature form is invalid.');
  });

  it('adds a creature with HP', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin', null, '1');
    await DmApp.assertCreatureVisible('goblin', '1');
  });

  it('shows an error when the creature HP is invalid', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin', null, '-1');
    await DmApp.assertError('Failed to create creature. Create creature form is invalid.');
  });

  it("adds creatures to the battle in the order they are submitted if they don't have initiative", async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin 1');
    await dmApp.addCreature('goblin 2');
    await DmApp.assertCreatureList(['goblin 1', 'goblin 2']);
  });

  it('adds creatures to the battle in initiative order', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin 1', '1');
    await dmApp.addCreature('goblin 2', '2');
    await DmApp.assertCreatureList(['goblin 2', 'goblin 1']);
  });

  it("allows a creature's initiative to be rolled", async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin 1', '1');
    await dmApp.addCreatureWithRolledInitiative('goblin 2');
    await DmApp.assertCreatureList(['goblin 2', 'goblin 1']);
  });

  it('creatures without initiative are added at the bottom of the initiative order', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin 1', '1');
    await dmApp.addCreature('goblin 2', '2');
    await dmApp.addCreature('goblin 3');
    await DmApp.assertCreatureList(['goblin 2', 'goblin 1', 'goblin 3']);
  });

  it('adds multiples of a creature to the battle', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin', null, null, '2');
    await DmApp.assertCreatureList(['goblin #1', 'goblin #2']);
  });

  it('adds the same HP to each multiplied creature', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin', null, '1', '2');
    await DmApp.assertCreatureVisible('goblin #1', '1');
    await DmApp.assertCreatureVisible('goblin #2', '1');
  });

  it('adds the same initiative to each multiplied creature', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('owlbear', '1', null);
    await dmApp.addCreature('goblin', '2', null, '2');
    await DmApp.assertCreatureList(['goblin #1', 'goblin #2', 'owlbear']);
  });

  it('adds the same rolled initiative to each multiplied creature', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('owlbear', '1', null);
    await dmApp.addCreatureWithRolledInitiative('goblin', null, '2');
    await DmApp.assertCreatureList(['goblin #1', 'goblin #2', 'owlbear']);
  });

  it('shows an error when the multiplier is less than 1', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin', null, null, '0');
    await DmApp.assertError('Failed to create creature. Create creature form is invalid.');
  });

  it('shows an error when the multiplier is greater than 50', async () => {
    const dmApp = new DmApp();
    await dmApp.addCreature('goblin', null, null, '51');
    await DmApp.assertError('Failed to create creature. Create creature form is invalid.');
  });
});
