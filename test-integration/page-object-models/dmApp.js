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

  async submitCreature() {
    const add = await screen.findByRole('button', { name: 'Add creature' });
    return this.user.click(add);
  }

  async enterCreatureName(name) {
    const nameField = await screen.findByText('Creature Name');
    return this.user.type(nameField, name);
  }

  async addCreature(name, initiative, hp, multiply) {
    await this.enterCreatureName(name);

    if (initiative) {
      const initiativeField = await screen.findByText('Initiative (optional)');
      await this.user.type(initiativeField, initiative);
    }

    if (hp) {
      const hpField = await screen.findByText('HP (optional)');
      await this.user.type(hpField, hp);
    }

    if (multiply) {
      const multiplyField = await screen.findByText('Multiply');
      await this.user.type(multiplyField, '{delete}');
      await this.user.type(multiplyField, multiply);
    }

    return this.submitCreature();
  }

  async addCreatureWithRolledInitiative(name, hp, multiply) {
    const rollInitiative = await screen.findByRole('button', { name: 'Roll Initiative' });
    await this.user.click(rollInitiative);
    return this.addCreature(name, null, hp, multiply);
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

  static async assertCreateCreatureSearch(name) {
    const search = await screen.findByRole('link', { name: `Search ${name} on D&D Beyond` });
    expect(search).toBeVisible();
    const expectedHref = `https://www.dndbeyond.com/monsters?filter-search=${name}&sort=cr`;
    return expect(search).toHaveAttribute('href', expectedHref);
  }
}
