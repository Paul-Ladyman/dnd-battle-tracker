import React from 'react';
import { render, screen, findByText, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DungeonMasterAppWrapper from '../src/components/app/DungeonMasterAppWrapper';

function findNoteTool() {
  return screen.findByRole('combobox', { name: 'add note for goblin' });
}

async function addCreature(user) {
  const name = await screen.findByText('Creature Name');
  await user.type(name, 'goblin');
  const add = await screen.findByRole('button', { name: 'Add creature' });
  await user.click(add);
}

async function addNote(user) {
  const noteTool = await findNoteTool();
  await user.type(noteTool, 'note 1');
  const add = await screen.findByRole('button', { name: 'Add Note' });
  await user.click(add);
}

async function addNoteByKeyboard(user) {
  const noteTool = await findNoteTool();
  await user.type(noteTool, 'note 1');
  fireEvent.keyDown(noteTool, { key: 'enter', keyCode: 13 });
}

describe('Creature note tool', () => {
  it('has no notes by default', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await addCreature(user);
    const noteTool = await findNoteTool();
    expect(noteTool).toHaveAttribute('aria-expanded', 'false');
    const notes = screen.queryByRole('listbox', { name: 'notes' });
    expect(notes).toBe(null);
  });

  it('allows a note to be added', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await addCreature(user);
    await addNote(user);
    const noteTool = await findNoteTool();
    await user.click(noteTool);
    const notes = await screen.findByRole('listbox', { name: 'notes' });
    const note = await findByText(notes, 'note 1');
    expect(note).toBeVisible();
  });

  it('allows a note to be added using the keyboard', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await addCreature(user);
    await addNoteByKeyboard(user);
    const noteTool = await findNoteTool();
    await user.click(noteTool);
    const notes = await screen.findByRole('listbox', { name: 'notes' });
    const note = await findByText(notes, 'note 1');
    expect(note).toBeVisible();
  });
});
