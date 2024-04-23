/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class SpellSlotsTool {
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
}
