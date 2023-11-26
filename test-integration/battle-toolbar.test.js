import DmApp from './page-object-models/dmApp';

describe('Time Elapsed', () => {
  it('begins at time zero', async () => {
    const dmApp = new DmApp();
    await dmApp.battleToolbar.assertTimeElapsed('00:00');
  });

  it('does not increment the timer when the battle starts', async () => {
    const dmApp = new DmApp();
    await dmApp.battleToolbar.startBattle();
    await dmApp.battleToolbar.assertTimeElapsed('00:00');
  });

  it.each([
    ['00', '06', 1],
    ['00', '12', 2],
    ['00', '54', 9],
    ['01', '00', 10],
    ['01', '06', 11],
  ])('increments the timer by %d minutes and %d seconds after %d rounds', async (minutes, seconds, rounds) => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin', '1', null, '2');
    await dmApp.battleToolbar.startBattle();
    await dmApp.battleToolbar.advanceTurns(rounds * 2);
    await dmApp.battleToolbar.assertTimeElapsed(`${minutes}:${seconds}`);
  });
});
