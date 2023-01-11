/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  screen,
  findByRole,
  findByText,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import DndBattleTracker from './dndBattleTracker';
import DungeonMasterAppWrapper from '../../src/components/app/DungeonMasterAppWrapper';

function findNoteTool(name) {
  return screen.findByRole('combobox', { name: `add note for ${name}` });
}

export default class DmApp extends DndBattleTracker {
  constructor() {
    super(<DungeonMasterAppWrapper />);
  }

  async addCreature(name) {
    const nameField = await screen.findByText('Creature Name');
    await this.user.type(nameField, name);
    const add = await screen.findByRole('button', { name: 'Add creature' });
    return this.user.click(add);
  }

  async addNote(name, note) {
    const noteTool = await findNoteTool(name);
    await this.user.type(noteTool, note);
    const add = await findByRole(noteTool.parentElement, 'button', { name: 'Add Note' });
    return this.user.click(add);
  }

  async addNoteByKeyboard(name, note) {
    const noteTool = await findNoteTool(name);
    await this.user.type(noteTool, note);
    return fireEvent.keyDown(noteTool, { key: 'enter', keyCode: 13 });
  }

  static async assertCreatureNoteToolClosed(name) {
    const noteTool = await findNoteTool(name);
    return expect(noteTool).toHaveAttribute('aria-expanded', 'false');
  }

  static assertCreatureNotesEmpty(name) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    expect(notes).toBe(null);
  }

  async assertCreatureNoteExists(name, noteText) {
    const noteTool = await findNoteTool(name);
    await this.user.click(noteTool);
    const notes = await screen.queryByRole('listbox', { name: `${name} notes` });
    const note = await findByText(notes, noteText);
    return expect(note).toBeVisible();
  }
}
