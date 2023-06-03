import DmApp from '../page-object-models/dmApp';

beforeAll(() => {
  window.FLAG_creatureToolbar = true;
});

describe('Condition tool', () => {
  it('opens the tool menu when selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.creatureToolbar.assertToolMenuVisible('goblin');
  });

  it('closes the tool menu when unselected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });

  it('lists all available conditions', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.conditionsTool.openConditions('goblin');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Blinded');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Charmed');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Deafened');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Exhaustion');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Frightened');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Grappled');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Incapacitated');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Invisible');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Paralyzed');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Petrified');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Poisoned');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Prone');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Restrained');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Stunned');
    await dmApp.conditionsTool.assertConditionAvailable('goblin', 'Unconscious');
  });

  it('allows a condition to be added', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.conditionsTool.addCondition('goblin', 'Blinded');
    await DmApp.assertCreatureVisible('goblin', null, null, 'Blinded');
  });

  it("removes a creature's existing condition from the list", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.conditionsTool.addCondition('goblin', 'Blinded');
    await dmApp.conditionsTool.addCondition('goblin', 'Charmed');
    await dmApp.conditionsTool.assertConditionNotAvailable('goblin', 'Blinded');
    await dmApp.conditionsTool.assertConditionNotAvailable('goblin', 'Charmed');
  });
});
