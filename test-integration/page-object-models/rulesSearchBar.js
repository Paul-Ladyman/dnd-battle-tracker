/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  getByRole,
  getByLabelText,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class RulesSearchBar {
  constructor(user) {
    this.user = user;
  }

  async enterText(text) {
    const searchBar = await screen.findByRole('search');
    const input = getByLabelText(searchBar, 'Search rules using D&D Beyond');
    return this.user.type(input, text);
  }

  async assertSearch(text) {
    const searchBar = await screen.findByRole('search');
    const link = getByRole(searchBar, 'link');
    return expect(link).toHaveAttribute('href', `https://www.dndbeyond.com/search?q=${text}`);
  }

  async assertOpen() {
    const searchBar = await screen.findByRole('search');
    return expect(searchBar).toBeVisible();
  }

  async assertClosed() {
    const searchBar = await screen.queryByRole('search');
    return expect(searchBar).toBeNull();
  }
}
