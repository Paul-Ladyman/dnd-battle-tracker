import { rest } from 'msw';
import DmApp from './page-object-models/dmApp';
import msw from './mocks/server';

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
