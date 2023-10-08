/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class BattleMenu {
  constructor(user) {
    this.user = user;
  }

  async toggle() {
    const button = await screen.findByRole('button', { name: 'Battle Menu' });
    return this.user.click(button);
  }

  async assertClosed() {
    const button = await screen.findByRole('button', { name: 'Battle Menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    const menu = screen.queryByRole('menu', { name: 'Battle Menu' });
    return expect(menu).toBeNull();
  }

  async assertOpen() {
    const button = await screen.findByRole('button', { name: 'Battle Menu' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.queryByRole('menu', { name: 'Battle Menu' });
    return expect(menu).toBeVisible();
  }

  async assertMenuItem(name) {
    const menu = await screen.findByRole('menu', { name: 'Battle Menu' });
    const item = await findByRole(menu, 'menuitem', { name });
    return expect(item).toBeVisible();
  }
}
