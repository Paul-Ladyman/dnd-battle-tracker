/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable class-methods-use-this */
import {
  screen,
  findByText,
  fireEvent,
  waitFor,
  getAllByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';

function findSrdSearch() {
  return screen.findByRole('combobox', { name: 'create creature form. Name (required)' });
}

export default class CreateCreatureForm {
  constructor(user) {
    this.user = user;
  }

  findHpField() {
    return screen.findByRole('combobox', { name: 'create creature form. Hit points (optional)' });
  }

  async submitCreature() {
    const add = await screen.findByRole('button', { name: 'Add creature' });
    return this.user.click(add);
  }

  async submitName() {
    const nameField = await screen.findByRole('combobox', { name: 'create creature form. Name (required)' });
    return fireEvent.keyDown(nameField, { key: 'enter', keyCode: 13 });
  }

  async submitInitiative() {
    const initiativeField = await screen.findByRole('textbox', { name: 'create creature form. Initiative (optional)' });
    return fireEvent.keyDown(initiativeField, { key: 'enter', keyCode: 13 });
  }

  async submitHp() {
    const hpField = await this.findHpField();
    return fireEvent.keyDown(hpField, { key: 'enter', keyCode: 13 });
  }

  async submitAc() {
    const acField = await screen.findByRole('spinbutton', { name: 'create creature form. AC (optional)' });
    return fireEvent.keyDown(acField, { key: 'enter', keyCode: 13 });
  }

  async submitQuantity() {
    const quantityField = await screen.findByRole('spinbutton', { name: 'create creature form. Quantity (required)' });
    return fireEvent.keyDown(quantityField, { key: 'enter', keyCode: 13 });
  }

  async enterCreatureName(name) {
    const nameField = await screen.findByText('Creature Name');
    return this.user.type(nameField, name);
  }

  async enterQuantity(quantity) {
    const quantityField = await screen.findByText('Quantity');
    await this.user.type(quantityField, '{backspace}');
    await this.user.type(quantityField, '{delete}');
    await this.user.type(quantityField, quantity);
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

  async selectHpRoll() {
    const hpDropdown = await this.findHpField();
    await this.user.click(hpDropdown);
    const hpOptions = screen.queryByRole('listbox', { name: 'Creature HP options' });
    const hpRoll = getAllByRole(hpOptions, 'option')[1];
    return this.user.click(hpRoll);
  }

  async selectHpAverage() {
    const hpDropdown = await this.findHpField();
    await this.user.click(hpDropdown);
    const hpOptions = screen.queryByRole('listbox', { name: 'Creature HP options' });
    const hpRoll = getAllByRole(hpOptions, 'option')[0];
    return this.user.click(hpRoll);
  }

  async selectHpRollByKeyboard() {
    const hpDropdown = await this.findHpField();
    await this.user.type(hpDropdown, '{AltLeft>}{ArrowDown}{/AltLeft}');
    fireEvent.keyDown(hpDropdown, { key: 'arrowdown', keyCode: 40 });
    fireEvent.keyDown(hpDropdown, { key: 'arrowdown', keyCode: 40 });
    return fireEvent.keyDown(hpDropdown, { key: 'enter', keyCode: 13 });
  }

  async openHpOptions() {
    const hpOptions = screen.queryByRole('listbox', { name: 'Creature HP options' });
    if (hpOptions) return Promise.resolve();
    const hpDropdown = await this.findHpField();
    return this.user.click(hpDropdown);
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

  async setRollInitiativePerCreature() {
    const initiativeRollButton = await screen.findByRole('button', { name: 'Roll initiative per creature' });
    return this.user.click(initiativeRollButton);
  }

  async setRollHpPerCreature() {
    const hpRollButton = await screen.findByRole('button', { name: 'Roll HP per creature' });
    return this.user.click(hpRollButton);
  }

  async setRollInitiativeAsGroup() {
    const initiativeRollButton = await screen.findByRole('button', { name: 'Roll initiative as group' });
    return this.user.click(initiativeRollButton);
  }

  async setRollHpAsGroup() {
    const hpRollButton = await screen.findByRole('button', { name: 'Roll HP as group' });
    return this.user.click(hpRollButton);
  }

  async addCreature(name, initiative, hp, quantity, rollEachInitiative, rollEachHp, ac) {
    await this.enterCreatureName(name);

    if (initiative) {
      const initiativeField = await screen.findByText('Initiative (optional)');
      await this.user.type(initiativeField, initiative);
    }

    if (hp) {
      const hpField = await screen.findByText('HP (optional)');
      await this.user.type(hpField, hp);
    }

    if (ac) {
      const acField = await screen.findByText('AC (optional)');
      await this.user.type(acField, ac);
    }

    if (quantity) {
      await this.enterQuantity(quantity);
    }

    if (rollEachInitiative) {
      await this.setRollInitiativePerCreature();
    }

    if (rollEachHp) {
      await this.setRollHpPerCreature();
    }

    return this.submitCreature();
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

  assertHpOptionsEmpty() {
    const names = screen.queryByRole('listbox', { name: 'Creature HP options' });
    expect(names).toBe(null);
  }

  async assertHpOptionExists(hp) {
    const hpOptions = screen.queryByRole('listbox', { name: 'Creature HP options' });
    const option = await findByText(hpOptions, hp);
    return expect(option).toBeVisible();
  }

  assertHpOptionsLength(length) {
    const hpOptions = screen.queryByRole('listbox', { name: 'Creature HP options' });
    expect(hpOptions.childElementCount).toBe(length);
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
    const hpField = await this.findHpField();
    await waitFor(() => expect(hpField).toHaveDisplayValue(hp));
  }

  async assertInitiative(initiative) {
    const initiativeField = await screen.findByLabelText('Initiative (optional)');
    await waitFor(() => expect(initiativeField).toHaveDisplayValue(initiative));
  }

  async assertAc(ac) {
    const acField = await screen.findByLabelText('AC (optional)');
    await waitFor(() => expect(acField).toHaveDisplayValue(ac));
  }
}
