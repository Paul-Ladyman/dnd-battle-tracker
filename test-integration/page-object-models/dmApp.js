/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  screen,
  findByRole,
  getByRole,
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

  async typeNote(name, note) {
    const noteTool = await findNoteTool(name);
    return this.user.type(noteTool, note);
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

  async editNote(name, noteText, newText) {
    const noteTool = await findNoteTool(name);
    await this.user.click(noteTool);
    const notes = await screen.queryByRole('listbox', { name: `${name} notes` });
    const note = await findByText(notes, noteText);
    await this.user.click(note);
    await this.user.type(noteTool, newText);
    const edit = await findByRole(noteTool.parentElement, 'button', { name: 'Edit Note' });
    return this.user.click(edit);
  }

  static async navigateNotesUp(name) {
    const noteTool = await findNoteTool(name);
    fireEvent.keyDown(noteTool, { key: 'arrowup', keyCode: 38 });
  }

  static async navigateNotesDown(name) {
    const noteTool = await findNoteTool(name);
    fireEvent.keyDown(noteTool, { key: 'arrowdown', keyCode: 40 });
  }

  static async navigateToNoteByKeyboard(name, noteText) {
    const noteTool = await findNoteTool(name);
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    const noteNodes = notes.childNodes;
    const noteIndex = Array.from(noteNodes).findIndex((node) => node.textContent === noteText);
    const navigationSteps = Array.from({ length: noteIndex });
    const promises = navigationSteps.map(() => new Promise((resolve) => {
      const keyDown = fireEvent.keyDown(noteTool, { key: 'arrowdown', keyCode: 40 });
      resolve(keyDown);
    }));
    return Promise.all(promises);
  }

  async editNoteByKeyboard(name, noteText, newText) {
    const noteTool = await findNoteTool(name);
    fireEvent.keyDown(noteTool, { key: 'arrowdown', keyCode: 40 });
    await DmApp.navigateToNoteByKeyboard(name, noteText);
    fireEvent.keyDown(noteTool, { key: 'enter', keyCode: 13 });
    await this.user.type(noteTool, newText);
    return fireEvent.keyDown(noteTool, { key: 'enter', keyCode: 13 });
  }

  async removeNote(name, noteText) {
    const noteTool = await findNoteTool(name);
    await this.user.click(noteTool);
    const notes = await screen.queryByRole('listbox', { name: `${name} notes` });
    const note = await findByText(notes, noteText);
    await this.user.click(note);
    const remove = await findByRole(noteTool.parentElement, 'button', { name: 'Remove note' });
    return this.user.click(remove);
  }

  static async removeNoteByKeyboard(name, noteText) {
    const noteTool = await findNoteTool(name);
    fireEvent.keyDown(noteTool, { key: 'arrowdown', keyCode: 40 });
    await DmApp.navigateToNoteByKeyboard(name, noteText);
    return fireEvent.keyDown(noteTool, { key: 'delete', keyCode: 46 });
  }

  async openNotes(name) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    if (notes) return Promise.resolve();
    const noteTool = await findNoteTool(name);
    return this.user.click(noteTool);
  }

  async closeNotes(name) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    if (notes) {
      const noteTool = await findNoteTool(name);
      return this.user.click(noteTool);
    }
    return Promise.resolve();
  }

  static async closeNotesByKeyboard(name) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    if (notes) {
      const noteTool = await findNoteTool(name);
      return fireEvent.keyDown(noteTool, { key: 'esc', keyCode: 27 });
    }
    return Promise.resolve();
  }

  async startBattle() {
    const banner = await screen.findByRole('banner');
    const startBattleButton = getByRole(banner, 'button', { name: 'Start battle' });
    return this.user.click(startBattleButton);
  }

  static async assertCreatureNoteToolClosed(name) {
    const noteTool = await findNoteTool(name);
    return expect(noteTool).toHaveAttribute('aria-expanded', 'false');
  }

  static async assertCreatureNoteToolOpen(name) {
    const noteTool = await findNoteTool(name);
    return expect(noteTool).toHaveAttribute('aria-expanded', 'true');
  }

  static assertCreatureNotesEmpty(name) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    expect(notes).toBe(null);
  }

  static async assertCreatureNoteSelected(name, noteText) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    const note = await findByText(notes, noteText);
    return expect(note).toHaveAttribute('aria-selected', 'true');
  }

  static async assertCreatureNoteNotSelected(name, noteText) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    const note = await findByText(notes, noteText);
    return expect(note).toHaveAttribute('aria-selected', 'false');
  }

  static async assertCreatureNoteExists(name, noteText) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    const note = await findByText(notes, noteText);
    return expect(note).toBeVisible();
  }

  static assertCreatureNotesLength(name, length) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    expect(notes.childElementCount).toBe(length);
  }

  static async assertCreateCreatureSearch(name) {
    const search = await screen.findByRole('link', { name: `Search ${name} on D&D Beyond` });
    expect(search).toBeVisible();
    const expectedHref = `https://www.dndbeyond.com/monsters?filter-search=${name}&sort=cr`;
    return expect(search).toHaveAttribute('href', expectedHref);
  }
}
