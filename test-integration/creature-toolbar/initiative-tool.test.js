import DmApp from '../page-object-models/dmApp';
import random from '../../src/util/random';

jest.mock('../../src/util/random');

beforeEach(() => {
  jest.resetAllMocks();
  random.mockReturnValue(0.999999);
});

describe('Initiative tool', () => {
  it('opens the tool menu when selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolMenuVisible('goblin');
  });

  it('closes the tool menu when unselected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it("is disabled if it is the creature's turn", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.initiativeTool.assertDisabled('goblin');
  });

  it("does not open the tool menu when selected if it is the creature's turn", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it("closes the tool menu when selected if it is the creature's turn", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creatureToolbar.selectTool('goblin', 'HP');
    await dmApp.creatureToolbar.selectTool('goblin', 'Initiative');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it("sets a creature's initiative", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Initiative');
    await dmApp.initiativeTool.setCreatureInitiative('goblin 1', '1');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Initiative');
    await dmApp.initiativeTool.setCreatureInitiative('goblin 2', '2');
    await dmApp.battleToolbar.startBattle();
    await DmApp.assertCreatureList(['goblin 2Active creature', 'goblin 1']);
  });

  it("allows a creature's initiative to be updated before the battle is started", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '2');
    await dmApp.createCreatureForm.addCreature('goblin 2', '1');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Initiative');
    await dmApp.initiativeTool.setCreatureInitiative('goblin 2', '3');
    await dmApp.battleToolbar.startBattle();
    await DmApp.assertCreatureList(['goblin 2Active creature', 'goblin 1']);
  });

  it("allows a creature's rolled initiative to be updated before the battle is started", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1d20');
    await dmApp.createCreatureForm.addCreature('goblin 2', '1d20');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Initiative');
    await dmApp.initiativeTool.setCreatureInitiative('goblin 2', '21');
    await dmApp.battleToolbar.startBattle();
    await DmApp.assertCreatureList(['goblin 2Active creature', 'goblin 1']);
  });

  it("allows a creature's initiative to be updated if it is not their turn", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '2');
    await dmApp.createCreatureForm.addCreature('goblin 2', '1');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Initiative');
    await dmApp.initiativeTool.setCreatureInitiative('goblin 2', '3');
    await dmApp.battleToolbar.nextTurn();
    await DmApp.assertCreatureList(['goblin 2Active creature', 'goblin 1']);
  });
});

describe('Tie Breaker tool', () => {
  it('sets the initiative order of two creatures with the same initiative', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreature('goblin 2', '1');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Initiative');
    await dmApp.initiativeTool.setTieBreaker('goblin 1', '1');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Initiative');
    await dmApp.initiativeTool.setTieBreaker('goblin 2', '2');
    await dmApp.battleToolbar.startBattle();
    await DmApp.assertCreatureList(['goblin 2Active creature', 'goblin 1']);
  });

  it('orders a creature with a tie breaker above a creature without one', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '1');
    await dmApp.createCreatureForm.addCreature('goblin 2', '1');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Initiative');
    await dmApp.initiativeTool.setTieBreaker('goblin 2', '2');
    await dmApp.battleToolbar.startBattle();
    await DmApp.assertCreatureList(['goblin 2Active creature', 'goblin 1']);
  });

  it('does nothing for two creatures with different initiative', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1', '2');
    await dmApp.createCreatureForm.addCreature('goblin 2', '1');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Initiative');
    await dmApp.initiativeTool.setTieBreaker('goblin 1', '1');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Initiative');
    await dmApp.initiativeTool.setTieBreaker('goblin 2', '2');
    await dmApp.battleToolbar.startBattle();
    await DmApp.assertCreatureList(['goblin 1Active creature', 'goblin 2']);
  });
});
