import DmApp from '../page-object-models/dmApp';

describe('Creature menu tool', () => {
  it('opens the tool menu when the Creature Menu toolbar button is selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.assertToolMenuVisible('goblin');
  });

  it('closes the tool menu when the Creature Menu toolbar button is unselected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.creatureToolbar.assertToolMenuNotVisible('goblin');
  });
});

describe('Stat block tool', () => {
  it("contains a link to creature's stat block when it has been created from the SRD", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addSrdCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.menuTool.assertCreatureStatBlockLink('Goblin');
  });

  it("does not link to creature's stat block when it has been created manually", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.menuTool.assertNoCreatureStatBlockLink('Goblin');
  });

  it("contains a link to search for a creature's stat block when it has been created manually", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.menuTool.assertCreatureSearchLink('Goblin');
  });

  it("does not contain a link to search for a creature's stat block when it has been created from the SRD", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addSrdCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.menuTool.assertNoCreatureSearchLink('Goblin');
  });
});

describe('Lock tool', () => {
  it('is unlocked by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.menuTool.assertCreatureUnlocked('Goblin');
  });

  it('locks a creature when clicked', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    await dmApp.menuTool.lockCreature('Goblin');
    return dmApp.menuTool.assertCreatureLocked('Goblin');
  });

  it('unlocks a creature when clicked again', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    await dmApp.menuTool.lockCreature('Goblin');
    await dmApp.menuTool.unlockCreature('Goblin');
    return dmApp.menuTool.assertCreatureUnlocked('Goblin');
  });

  it('locks all selected creatures', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creature.select('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Creature Menu');
    await dmApp.menuTool.lockCreature('goblin 1');
    await dmApp.menuTool.assertCreatureLocked('goblin 1');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Creature Menu');
    return dmApp.menuTool.assertCreatureLocked('goblin 2');
  });

  it('unlocks all selected creatures', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Creature Menu');
    await dmApp.menuTool.lockCreature('goblin 1');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Creature Menu');
    await dmApp.menuTool.lockCreature('goblin 2');

    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creature.select('goblin 2');

    await dmApp.creatureToolbar.selectTool('goblin 1', 'Creature Menu');
    await dmApp.menuTool.unlockCreature('goblin 1');
    await dmApp.menuTool.assertCreatureUnlocked('goblin 1');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Creature Menu');
    return dmApp.menuTool.assertCreatureUnlocked('goblin 2');
  });

  it('handles a mix of locked and unlocked selected creatures', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Creature Menu');
    await dmApp.menuTool.lockCreature('goblin 1');

    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creature.select('goblin 2');

    await dmApp.creatureToolbar.selectTool('goblin 2', 'Creature Menu');
    await dmApp.menuTool.lockCreature('goblin 2');
    await dmApp.menuTool.assertCreatureLocked('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Creature Menu');
    return dmApp.menuTool.assertCreatureLocked('goblin 1');
  });
});

describe('Share tool', () => {
  it('is shared by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.menuTool.assertCreatureShared('Goblin');
  });

  it('unshares a creature when clicked', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    await dmApp.menuTool.unshareCreature('Goblin');
    return dmApp.menuTool.assertCreatureNotShared('Goblin');
  });

  it('shares a creature when clicked again', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    await dmApp.menuTool.unshareCreature('Goblin');
    await dmApp.menuTool.shareCreature('Goblin');
    return dmApp.menuTool.assertCreatureShared('Goblin');
  });

  it('unshares all selected creatures', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creature.select('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Creature Menu');
    await dmApp.menuTool.unshareCreature('goblin 1');
    await dmApp.menuTool.assertCreatureNotShared('goblin 1');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Creature Menu');
    return dmApp.menuTool.assertCreatureNotShared('goblin 2');
  });

  it('shares all selected creatures', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Creature Menu');
    await dmApp.menuTool.unshareCreature('goblin 1');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Creature Menu');
    await dmApp.menuTool.unshareCreature('goblin 2');

    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creature.select('goblin 2');

    await dmApp.creatureToolbar.selectTool('goblin 1', 'Creature Menu');
    await dmApp.menuTool.shareCreature('goblin 1');
    await dmApp.menuTool.assertCreatureShared('goblin 1');
    await dmApp.creatureToolbar.selectTool('goblin 2', 'Creature Menu');
    return dmApp.menuTool.assertCreatureShared('goblin 2');
  });

  it('handles a mix of shared and unshared selected creatures', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Creature Menu');
    await dmApp.menuTool.unshareCreature('goblin 1');

    await dmApp.creatureToolbar.selectTool('goblin 1', 'Select');
    await dmApp.creature.select('goblin 2');

    await dmApp.creatureToolbar.selectTool('goblin 2', 'Creature Menu');
    await dmApp.menuTool.unshareCreature('goblin 2');
    await dmApp.menuTool.assertCreatureNotShared('goblin 2');
    await dmApp.creatureToolbar.selectTool('goblin 1', 'Creature Menu');
    return dmApp.menuTool.assertCreatureNotShared('goblin 1');
  });

  it("is disabled by default if it is the creature's turn", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', '1');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.menuTool.assertCreatureShareDisabled('Goblin');
  });

  it('does nothing if clicked whilst disabled', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', '1');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    await dmApp.menuTool.unshareCreature('Goblin');
    return dmApp.menuTool.assertCreatureShared('Goblin');
  });

  it("is enabled if it is the creature's turn but the creature is already unshared", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', '1');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    await dmApp.menuTool.unshareCreature('Goblin');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.menuTool.assertCreatureShareEnabled('Goblin');
  });

  it('shares a creature during its turn', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', '1');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    await dmApp.menuTool.unshareCreature('Goblin');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    await dmApp.menuTool.shareCreature('Goblin');
    return dmApp.menuTool.assertCreatureShared('Goblin');
  });
});

describe('Share HP tool', () => {
  it('is shared by default', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.menuTool.assertHPShared('Goblin');
  });

  it("unshares a creature's HP when clicked", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    await dmApp.menuTool.unshareHP('Goblin');
    return dmApp.menuTool.assertHPNotShared('Goblin');
  });

  it("shares a creature's HP when clicked again", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    await dmApp.menuTool.unshareHP('Goblin');
    await dmApp.menuTool.shareHP('Goblin');
    return dmApp.menuTool.assertHPShared('Goblin');
  });

  it('is disabled if the creature is selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1');
    await dmApp.creatureToolbar.selectTool('goblin', 'Select');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    return dmApp.menuTool.assertHPShareDisabled('goblin');
  });

  it('does nothing when disabled', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1');
    await dmApp.creatureToolbar.selectTool('goblin', 'Select');
    await dmApp.creatureToolbar.selectTool('goblin', 'Creature Menu');
    await dmApp.menuTool.unshareHP('goblin');
    return dmApp.menuTool.assertHPShared('goblin');
  });
});

describe('Remove tool', () => {
  it('does nothing when clicked if not confirmed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', null, null, '2');
    await dmApp.creatureToolbar.selectTool('Goblin #1', 'Creature Menu');
    await dmApp.menuTool.removeCreature('Goblin #1');
    return DmApp.assertCreatureList(['Goblin #1', 'Goblin #2']);
  });

  it('asks the user to confirm removing the creature', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', null, null, '2');
    await dmApp.creatureToolbar.selectTool('Goblin #1', 'Creature Menu');
    await dmApp.menuTool.removeCreature('Goblin #1');
    return dmApp.alert.assertMessage('Are you sure you want to remove Goblin #1?');
  });

  it('removes a creature when confirmed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', null, null, '2');
    await dmApp.creatureToolbar.selectTool('Goblin #1', 'Creature Menu');
    await dmApp.menuTool.removeCreature('Goblin #1');
    await dmApp.alert.clickYes();
    return DmApp.assertCreatureList(['Goblin #2']);
  });

  it('does not remove the creature when cancelled', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', null, null, '2');
    await dmApp.creatureToolbar.selectTool('Goblin #1', 'Creature Menu');
    await dmApp.menuTool.removeCreature('Goblin #1');
    await dmApp.alert.clickNo();
    await dmApp.alert.assertNotVisible();
    return DmApp.assertCreatureList(['Goblin #1', 'Goblin #2']);
  });

  it('returns focus to the remove tool when cancelled', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', null, null, '2');
    await dmApp.creatureToolbar.selectTool('Goblin #1', 'Creature Menu');
    await dmApp.menuTool.removeCreature('Goblin #1');
    await dmApp.alert.clickNo();
    await dmApp.alert.assertNotVisible();
    await dmApp.creatureToolbar.assertToolMenuVisible('Goblin #1');
    await dmApp.menuTool.assertRemoveCreatureFocused('Goblin #1');
  });

  it('does not remove the creature when cancelled by keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', null, null, '2');
    await dmApp.creatureToolbar.selectTool('Goblin #1', 'Creature Menu');
    await dmApp.menuTool.removeCreature('Goblin #1');
    await dmApp.alert.close();
    await dmApp.alert.assertNotVisible();
    return DmApp.assertCreatureList(['Goblin #1', 'Goblin #2']);
  });

  it('returns focus to the remove tool when cancelled by keyboard', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', null, null, '2');
    await dmApp.creatureToolbar.selectTool('Goblin #1', 'Creature Menu');
    await dmApp.menuTool.removeCreature('Goblin #1');
    await dmApp.alert.close();
    await dmApp.alert.assertNotVisible();
    await dmApp.creatureToolbar.assertToolMenuVisible('Goblin #1');
    await dmApp.menuTool.assertRemoveCreatureFocused('Goblin #1');
  });

  it("is disabled if it is the creature's turn", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', '1');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.menuTool.assertRemoveCreatureDisabled('Goblin');
  });

  it('is disabled if the creature is selected', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', '1');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Select');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    return dmApp.menuTool.assertRemoveCreatureDisabled('Goblin');
  });

  it("does not allow removing a creature to be confirmed when it is the creature's turn", async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', '1');
    await dmApp.battleToolbar.startBattle();
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    await dmApp.menuTool.removeCreature('Goblin');
    await dmApp.alert.assertNotVisible();
  });

  it('allows the battle to be restarted after the last creature is removed', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('Goblin', '1');
    await dmApp.creatureToolbar.selectTool('Goblin', 'Creature Menu');
    await dmApp.menuTool.removeCreature('Goblin');
    await dmApp.alert.clickYes();
    await dmApp.createCreatureForm.addCreature('Goblin 2', '1');
    await dmApp.battleToolbar.startBattle();
    return DmApp.assertCreatureList(['Goblin 2Active creature']);
  });
});
