import DmApp from '../page-object-models/dmApp';

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

  it('sets conditions to inactive by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Blinded');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Charmed');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Deafened');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Exhaustion');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Frightened');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Grappled');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Incapacitated');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Invisible');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Paralyzed');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Petrified');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Poisoned');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Prone');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Restrained');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Stunned');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Unconscious');
  });

  it('allows a condition to be added to a creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.conditionsTool.selectCondition('goblin', 'Blinded');
    await DmApp.assertCreatureVisible('goblin', null, null, 'Blinded');
  });

  it('allows a condition to be added to a creature using the keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.conditionsTool.selectConditionUsingKeyboard('goblin', 'Blinded');
    await DmApp.assertCreatureVisible('goblin', null, null, 'Blinded');
  });

  it('sets the condition to be active when added', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.conditionsTool.selectCondition('goblin', 'Blinded');
    await dmApp.conditionsTool.assertConditionActive('goblin', 'Blinded');
  });

  it('allows a condition to be removed from a creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.conditionsTool.selectCondition('goblin', 'Blinded');
    await dmApp.conditionsTool.selectCondition('goblin', 'Blinded');
    await dmApp.creature.expand('goblin');
    await dmApp.creature.assertExpandedTextNotVisible('goblin', 'Blinded');
  });

  it('sets the condition to be inactive when remove', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');
    await dmApp.conditionsTool.selectCondition('goblin', 'Blinded');
    await dmApp.conditionsTool.selectCondition('goblin', 'Blinded');
    await dmApp.conditionsTool.assertConditionInactive('goblin', 'Blinded');
  });
});
