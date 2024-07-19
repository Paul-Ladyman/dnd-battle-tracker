/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  getByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class Navigation {
  constructor(user) {
    this.user = user;
  }

  async navigateTo(view) {
    const nav = await screen.findByRole('navigation');
    const navButton = getByRole(nav, 'button', { name: view });
    return this.user.click(navButton);
  }
}
