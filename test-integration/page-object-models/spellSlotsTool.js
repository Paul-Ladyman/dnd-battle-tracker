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

  async assertUsedTabSelected() {
    const tablist = await screen.findByRole('tablist', { name: 'Spell Slots' });
    const tab = await findByRole(tablist, 'tab', { name: 'Used' });
    return expect(tab).toHaveAttribute('aria-selected', 'true');
  }

  async assertTotalTabUnselected() {
    const tablist = await screen.findByRole('tablist', { name: 'Spell Slots' });
    const tab = await findByRole(tablist, 'tab', { name: 'Total' });
    return expect(tab).toHaveAttribute('aria-selected', 'false');
  }
}
