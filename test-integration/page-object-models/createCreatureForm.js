/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable class-methods-use-this */
import {
  screen,
  findByText,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

function findSrdSearch() {
  return screen.findByRole('combobox', { name: 'create creature form. Name (required)' });
}

export default class CreateCreatureForm {
  constructor(user) {
    this.user = user;
  }

  async submitCreature() {
    const add = await screen.findByRole('button', { name: 'Add creature' });
    return this.user.click(add);
  }

  async enterCreatureName(name) {
    const nameField = await screen.findByText('Creature Name');
    return this.user.type(nameField, name);
  }

  async navigateToCreatureByKeyboard(nameText) {
    const srdSearch = await findSrdSearch();
    const creatures = screen.queryByRole('listbox', { name: 'Creature search results' });
    const creatureNodes = creatures.childNodes;
    const creatureIndex = Array.from(creatureNodes)
      .findIndex((node) => node.textContent === nameText);
    const navigationSteps = Array.from({ length: creatureIndex + 1 });
    const promises = navigationSteps.map(() => new Promise((resolve) => {
      const keyDown = fireEvent.keyDown(srdSearch, { key: 'arrowdown', keyCode: 40 });
      resolve(keyDown);
    }));
    return Promise.all(promises);
  }

  async selectSrdCreature(name) {
    await this.enterCreatureName(name);
    const creatures = screen.queryByRole('listbox', { name: 'Creature search results' });
    const creature = await findByText(creatures, name);
    return this.user.click(creature);
  }

  async addSrdCreature(name) {
    await this.enterCreatureName(name);
    const creatures = screen.queryByRole('listbox', { name: 'Creature search results' });
    const creature = await findByText(creatures, name);
    await this.user.click(creature);
    return this.submitCreature();
  }

  async selectSrdCreatureByKeyboard(name) {
    await this.enterCreatureName(name);
    await this.navigateToCreatureByKeyboard(name);
    const srdSearch = await findSrdSearch();
    return fireEvent.keyDown(srdSearch, { key: 'enter', keyCode: 13 });
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

  static async assertCreateCreatureSearch(name) {
    const search = await screen.findByRole('link', { name: `Search ${name} on D&D Beyond` });
    expect(search).toBeVisible();
    const expectedHref = `https://www.dndbeyond.com/monsters?filter-search=${name}&sort=cr`;
    return expect(search).toHaveAttribute('href', expectedHref);
  }

  async typeName(name) {
    const srdSearch = await findSrdSearch();
    return this.user.type(srdSearch, name);
  }

  async navigateCreaturesUp() {
    const srdSearch = await findSrdSearch();
    fireEvent.keyDown(srdSearch, { key: 'arrowup', keyCode: 38 });
  }

  async navigateCreaturesDown() {
    const srdSearch = await findSrdSearch();
    fireEvent.keyDown(srdSearch, { key: 'arrowdown', keyCode: 40 });
  }

  async openCreatures() {
    const names = screen.queryByRole('listbox', { name: 'Creature search results' });
    if (names) return Promise.resolve();
    const srdSearch = await findSrdSearch();
    return this.user.click(srdSearch);
  }

  async closeCreatures() {
    const names = screen.queryByRole('listbox', { name: 'Creature search results' });
    if (names) {
      const srdSearch = await findSrdSearch();
      return this.user.click(srdSearch);
    }
    return Promise.resolve();
  }

  async closeCreaturesByKeyboard() {
    const names = screen.queryByRole('listbox', { name: 'Creature search results' });
    if (names) {
      const srdSearch = await findSrdSearch();
      return fireEvent.keyDown(srdSearch, { key: 'esc', keyCode: 27 });
    }
    return Promise.resolve();
  }

  async assertSrdSearchClosed() {
    const srdSearch = await findSrdSearch();
    return expect(srdSearch).toHaveAttribute('aria-expanded', 'false');
  }

  async assertSrdSearchOpen() {
    const srdSearch = await findSrdSearch();
    return expect(srdSearch).toHaveAttribute('aria-expanded', 'true');
  }

  assertCreaturesEmpty() {
    const names = screen.queryByRole('listbox', { name: 'Creature search results' });
    expect(names).toBe(null);
  }

  async assertCreatureSelected(nameText) {
    const names = screen.queryByRole('listbox', { name: 'Creature search results' });
    const name = await findByText(names, nameText);
    return expect(name).toHaveAttribute('aria-selected', 'true');
  }

  async assertCreatureNotSelected(nameText) {
    const names = screen.queryByRole('listbox', { name: 'Creature search results' });
    const name = await findByText(names, nameText);
    return expect(name).toHaveAttribute('aria-selected', 'false');
  }

  async assertCreatureExists(nameText) {
    const names = screen.queryByRole('listbox', { name: 'Creature search results' });
    const name = await findByText(names, nameText);
    return expect(name).toBeVisible();
  }

  assertCreaturesLength(length) {
    const names = screen.queryByRole('listbox', { name: 'Creature search results' });
    expect(names.childElementCount).toBe(length);
  }

  async assertName(name) {
    const srdSearch = await findSrdSearch();
    await waitFor(() => expect(srdSearch).toHaveDisplayValue(name));
  }

  async assertHp(hp) {
    const hpField = await screen.findByLabelText('HP (optional)');
    await waitFor(() => expect(hpField).toHaveDisplayValue(hp));
  }
}
