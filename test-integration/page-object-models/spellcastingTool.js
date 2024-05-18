/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByRole,
  findAllByRole,
  findByText,
  queryByRole,
  getByText,
  queryByText,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class SpellcastingTool {
  constructor(user) {
    this.user = user;
  }

  async openTotalSpellSlots(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tab = await findByRole(toolMenu, 'tab', { name: 'Total slots' });
    return this.user.click(tab);
  }

  async openUsedSpellSlots(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tab = await findByRole(toolMenu, 'tab', { name: 'Used slots' });
    return this.user.click(tab);
  }

  async openUsedSpells(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tab = await findByRole(toolMenu, 'tab', { name: 'Used spells' });
    return this.user.click(tab);
  }

  async openTotalSpells(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tab = await findByRole(toolMenu, 'tab', { name: 'Total spells' });
    return this.user.click(tab);
  }

  async setUsedSpellSlotValue(name, level, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used slots' });
    const spellSlot = await findByRole(tabPanel, 'spinbutton', { name: `${level} Level` });
    return this.user.type(spellSlot, value);
  }

  async setTotalSpellSlotValue(name, level, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Total slots' });
    const spellSlot = await findByRole(tabPanel, 'spinbutton', { name: `${level} Level` });
    return this.user.type(spellSlot, value);
  }

  async addUsedSpell(name, spell) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tab = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });
    const spellTool = await findByRole(tab, 'combobox', { name: `Add spells for ${name}` });
    await this.user.type(spellTool, spell);
    const add = await findByRole(spellTool.parentElement, 'button', { name: 'Add spell' });
    return this.user.click(add);
  }

  async searchUsedSrdSpell(name, spell) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tab = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });
    const spellTool = await findByRole(tab, 'combobox', { name: `Add spells for ${name}` });
    return this.user.type(spellTool, spell);
  }

  async addUsedSrdSpell(name, spell) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tab = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });
    const spellTool = await findByRole(tab, 'combobox', { name: `Add spells for ${name}` });
    await this.user.type(spellTool, spell);

    const spells = queryByRole(tab, 'listbox', { name: 'Spell search results' });
    const spellResult = await findByText(spells, spell);
    await this.user.click(spellResult);

    const add = await findByRole(spellTool.parentElement, 'button', { name: 'Add spell' });
    return this.user.click(add);
  }

  async addTotalSpell(name, spell) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tab = await findByRole(toolMenu, 'tabpanel', { name: 'Total spells' });
    const spellTool = await findByRole(tab, 'combobox', { name: `Add spells for ${name}` });
    await this.user.type(spellTool, spell);
    const add = await findByRole(spellTool.parentElement, 'button', { name: 'Add spell' });
    return this.user.click(add);
  }

  async setTotalSpellValue(name, spell, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Total spells' });
    const totalSpell = await findByRole(tabPanel, 'spinbutton', { name: spell });
    return this.user.type(totalSpell, value);
  }

  async setUsedSpellValue(name, spell, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });
    const usedSpell = await findByRole(tabPanel, 'spinbutton', { name: spell });
    return this.user.type(usedSpell, value);
  }

  async assertUsedSpellSlotValue(name, level, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used slots' });
    const spellSlot = await findByRole(tabPanel, 'spinbutton', { name: `${level} Level` });
    return expect(spellSlot).toHaveValue(value);
  }

  async assertUsedSpellSlotDisabled(name, level) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used slots' });
    const spellSlot = await findByRole(tabPanel, 'spinbutton', { name: `${level} Level` });
    return expect(spellSlot).toHaveAttribute('aria-disabled', 'true');
  }

  async assertUsedSpellSlotMin(name, level, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used slots' });
    const spellSlot = await findByRole(tabPanel, 'spinbutton', { name: `${level} Level` });
    return expect(spellSlot).toHaveAttribute('min', value);
  }

  async assertUsedSpellSlotMax(name, level, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used slots' });
    const spellSlot = await findByRole(tabPanel, 'spinbutton', { name: `${level} Level` });
    return expect(spellSlot).toHaveAttribute('max', value);
  }

  async assertTotalSpellSlotValue(name, level, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Total slots' });
    const spellSlot = await findByRole(tabPanel, 'spinbutton', { name: `${level} Level` });
    return expect(spellSlot).toHaveValue(value);
  }

  async assertTotalSpellSlotMin(name, level, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Total slots' });
    const spellSlot = await findByRole(tabPanel, 'spinbutton', { name: `${level} Level` });
    return expect(spellSlot).toHaveAttribute('min', value);
  }

  async assertTotalSpellSlotMax(name, level, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Total slots' });
    const spellSlot = await findByRole(tabPanel, 'spinbutton', { name: `${level} Level` });
    return expect(spellSlot).toHaveAttribute('max', value);
  }

  async assertUsedSpellsEmpty(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });
    const spells = queryByRole(tabPanel, 'list', { name: 'Spells' });
    return expect(spells).toBeNull();
  }

  async assertTotalSpellsEmpty(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Total spells' });
    const spells = queryByRole(tabPanel, 'list', { name: 'Spells' });
    return expect(spells).toBeNull();
  }

  async assertUsedSpellsContains(name, spell) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });
    const spells = await findByRole(tabPanel, 'list', { name: 'Spells' });
    const usedSpell = getByText(spells, spell);
    return expect(usedSpell).toBeVisible();
  }

  async assertTotalSpellsContains(name, spell) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Total spells' });
    const spells = await findByRole(tabPanel, 'list', { name: 'Spells' });
    const usedSpell = getByText(spells, spell);
    return expect(usedSpell).toBeVisible();
  }

  async assertUsedSpellValue(name, spell, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });
    const usedSpell = await findByRole(tabPanel, 'spinbutton', { name: spell });
    return expect(usedSpell).toHaveValue(value);
  }

  async assertUsedSpellMin(name, spell, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });
    const usedSpell = await findByRole(tabPanel, 'spinbutton', { name: spell });
    return expect(usedSpell).toHaveAttribute('min', value);
  }

  async assertUsedSpellMax(name, spell, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });
    const totalSpell = await findByRole(tabPanel, 'spinbutton', { name: spell });
    return expect(totalSpell).toHaveAttribute('max', value);
  }

  async assertTotalSpellValue(name, spell, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Total spells' });
    const totalSpell = await findByRole(tabPanel, 'spinbutton', { name: spell });
    return expect(totalSpell).toHaveValue(value);
  }

  async assertTotalSpells(name, number) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Total spells' });
    const spells = await findAllByRole(tabPanel, 'listitem');
    return expect(spells).toHaveLength(number);
  }

  async assertTotalSpellMin(name, spell, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Total spells' });
    const totalSpell = await findByRole(tabPanel, 'spinbutton', { name: spell });
    return expect(totalSpell).toHaveAttribute('min', value);
  }

  async assertTotalSpellMax(name, spell, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Total spells' });
    const totalSpell = await findByRole(tabPanel, 'spinbutton', { name: spell });
    return expect(totalSpell).toHaveAttribute('max', value);
  }

  async assertUsedSpellDisabled(name, spell) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });
    const spellSlot = await findByRole(tabPanel, 'spinbutton', { name: spell });
    return expect(spellSlot).toHaveAttribute('aria-disabled', 'true');
  }

  async assertUsedSrdSpell(name, spell) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tab = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });

    const spells = queryByRole(tab, 'listbox', { name: 'Spell search results' });
    const spellResult = await findByText(spells, spell);
    return expect(spellResult).toBeVisible();
  }

  async assertNotUsedSrdSpell(name, spell) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tab = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });

    const spells = queryByRole(tab, 'listbox', { name: 'Spell search results' });
    const spellResult = queryByText(spells, spell);
    return expect(spellResult).toBeNull();
  }

  async assertNoUsedSrdSpells(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tab = await findByRole(toolMenu, 'tabpanel', { name: 'Used spells' });

    const spells = queryByRole(tab, 'listbox', { name: 'Spell search results' });
    return expect(spells).toBeNull();
  }
}
