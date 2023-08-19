/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByRole,
  queryByRole,
  getByText,
  queryByText,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class Creature {
  constructor(user) {
    this.user = user;
  }

  async expand(name) {
    const creature = await screen.findByRole('region', { name });
    const button = await findByRole(creature, 'button', { name: `expand ${name}` });
    return this.user.click(button);
  }

  async assertExpandedTextVisible(name, text) {
    const creature = await screen.findByRole('region', { name: `${name} expanded` });
    expect(getByText(creature, text)).toBeVisible();
  }

  async assertExpandedTextNotVisible(name, text) {
    const creature = await screen.findByRole('region', { name: `${name} expanded` });
    expect(queryByText(creature, text)).toBeNull();
  }

  async assertNoSpellSlots(name) {
    const creature = await screen.findByRole('region', { name: `${name} expanded` });
    const meter = queryByRole(creature, 'meter', { name: /.* Level/ });
    expect(meter).toBeNull();
  }

  async assertSpellSlots(name, level, max, now) {
    const creature = await screen.findByRole('region', { name: `${name} expanded` });
    const meter = await findByRole(creature, 'meter', { name: `${level} Level` });
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', max);
    expect(meter).toHaveAttribute('aria-valuenow', now);
  }
}
