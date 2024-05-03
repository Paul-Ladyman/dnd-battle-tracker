/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByRole,
  queryByRole,
  getAllByText,
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
    const screenText = getAllByText(creature, (_, element) => element.textContent === text);
    expect(screenText.length).toBeGreaterThan(0);
  }

  async assertExpandedTextNotVisible(name, text) {
    const creature = await screen.findByRole('region', { name: `${name} expanded` });
    expect(queryByText(creature, text)).toBeNull();
  }

  async assertNoSpellMeters(name) {
    const creature = await screen.findByRole('region', { name: `${name} expanded` });
    const meter = queryByRole(creature, 'meter', { name: /.* Level/ });
    expect(meter).toBeNull();
  }

  async assertSpellMeters(name, label, max, now) {
    const creature = await screen.findByRole('region', { name: `${name} expanded` });
    const meter = await findByRole(creature, 'meter', { name: label });
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', max);
    expect(meter).toHaveAttribute('aria-valuenow', now);
  }

  async assertFocused(name) {
    const creature = await screen.findByRole('region', { name });
    const button = await findByRole(creature, 'button', { name: `expand ${name}` });
    expect(button).toHaveFocus();
  }
}
