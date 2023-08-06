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
    const tab = await findByRole(toolMenu, 'tab', { name: 'Total' });
    return this.user.click(tab);
  }

  async assertUsedSpellSlotValue(name, level, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Used' });
    const spellSlot = await findByRole(tabPanel, 'spinbutton', { name: `${level} Level` });
    return expect(spellSlot).toHaveValue(value);
  }

  async assertTotalSpellSlotValue(name, level, value) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tabPanel = await findByRole(toolMenu, 'tabpanel', { name: 'Total' });
    const spellSlot = await findByRole(tabPanel, 'spinbutton', { name: `${level} Level` });
    return expect(spellSlot).toHaveValue(value);
  }
}
