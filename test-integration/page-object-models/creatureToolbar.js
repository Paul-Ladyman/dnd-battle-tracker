/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByRole,
  findByText,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';

function findNoteTool(name) {
  return screen.findByRole('combobox', { name: `add note for ${name}` });
}

export default class CreatureToolbar {
  constructor(user) {
    this.user = user;
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

  async navigateNotesUp(name) {
    const noteTool = await findNoteTool(name);
    fireEvent.keyDown(noteTool, { key: 'arrowup', keyCode: 38 });
  }

  async navigateNotesDown(name) {
    const noteTool = await findNoteTool(name);
    fireEvent.keyDown(noteTool, { key: 'arrowdown', keyCode: 40 });
  }

  async navigateToNoteByKeyboard(name, noteText) {
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
    await this.navigateToNoteByKeyboard(name, noteText);
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

  async removeNoteByKeyboard(name, noteText) {
    const noteTool = await findNoteTool(name);
    fireEvent.keyDown(noteTool, { key: 'arrowdown', keyCode: 40 });
    await this.navigateToNoteByKeyboard(name, noteText);
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

  async closeNotesByKeyboard(name) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    if (notes) {
      const noteTool = await findNoteTool(name);
      return fireEvent.keyDown(noteTool, { key: 'esc', keyCode: 27 });
    }
    return Promise.resolve();
  }

  async assertCreatureNoteToolClosed(name) {
    const noteTool = await findNoteTool(name);
    return expect(noteTool).toHaveAttribute('aria-expanded', 'false');
  }

  async assertCreatureNoteToolOpen(name) {
    const noteTool = await findNoteTool(name);
    return expect(noteTool).toHaveAttribute('aria-expanded', 'true');
  }

  assertCreatureNotesEmpty(name) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    expect(notes).toBe(null);
  }

  async assertCreatureNoteSelected(name, noteText) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    const note = await findByText(notes, noteText);
    return expect(note).toHaveAttribute('aria-selected', 'true');
  }

  async assertCreatureNoteNotSelected(name, noteText) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    const note = await findByText(notes, noteText);
    return expect(note).toHaveAttribute('aria-selected', 'false');
  }

  async assertCreatureNoteExists(name, noteText) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    const note = await findByText(notes, noteText);
    return expect(note).toBeVisible();
  }

  assertCreatureNotesLength(name, length) {
    const notes = screen.queryByRole('listbox', { name: `${name} notes` });
    expect(notes.childElementCount).toBe(length);
  }
}
