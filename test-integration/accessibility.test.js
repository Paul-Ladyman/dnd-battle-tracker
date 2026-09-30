import {
  fireEvent,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import DmApp from './page-object-models/dmApp';

describe('Accessibility relationships', () => {
  it('does not reuse creature wrapper ids', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin 1');
    await dmApp.createCreatureForm.addCreature('goblin 2');

    const creatureWrappers = document.querySelectorAll('section[data-creature-id]');
    const ids = Array.from(creatureWrappers)
      .map((wrapper) => wrapper.id)
      .filter(Boolean);

    expect(creatureWrappers).toHaveLength(2);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses unique toolbar button ids and expands only the selected tool', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.addCreature('goblin');

    const toolbar = await screen.findByRole('toolbar', { name: 'goblin toolbar' });
    const selectButton = await screen.findByRole('button', { name: 'Select' });
    const conditionsButton = await screen.findByRole('button', { name: 'Conditions' });

    expect(selectButton.id).not.toBe(conditionsButton.id);

    await dmApp.creatureToolbar.selectTool('goblin', 'Conditions');

    expect(conditionsButton).toHaveAttribute('aria-expanded', 'true');
    expect(toolbar.querySelectorAll('button[aria-expanded="true"]')).toHaveLength(1);
  });

  it('points a combobox active descendant at the focused option', async () => {
    const dmApp = new DmApp();
    await dmApp.createCreatureForm.typeName('Goblin');
    await dmApp.createCreatureForm.assertCreatureExists('Goblin');

    const input = await screen.findByRole('combobox', {
      name: 'create creature form. Name (required)',
    });

    fireEvent.keyDown(input, { key: 'arrowdown', keyCode: 40 });

    const activeId = input.getAttribute('aria-activedescendant');
    const activeOption = document.getElementById(activeId);

    expect(activeId).toBeTruthy();
    expect(activeOption).not.toBeNull();
    expect(activeOption).toHaveRole('option');
    expect(activeOption).toHaveAttribute('aria-selected', 'true');
  });
});
