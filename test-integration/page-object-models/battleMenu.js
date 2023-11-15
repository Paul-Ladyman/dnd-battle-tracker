/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByRole,
  findAllByRole,
  fireEvent,
  queryByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

export default class BattleMenu {
  constructor(user) {
    this.user = user;
  }

  async toggle() {
    const button = await screen.findByRole('button', { name: 'Battle Menu' });
    return this.user.click(button);
  }

  async closeByKeyboard() {
    const button = await screen.findByRole('button', { name: 'Battle Menu' });
    return fireEvent.keyDown(button, { key: 'esc', keyCode: 27 });
  }

  async navigate(steps, forward = true) {
    const button = await screen.findByRole('button', { name: 'Battle Menu' });
    const navigationSteps = Array.from({ length: steps });
    const key = forward ? 'ArrowDown' : 'ArrowUp';
    const keyCode = forward ? 40 : 38;
    const promises = navigationSteps.map(() => new Promise((resolve) => {
      const keyDown = fireEvent.keyDown(button, { key, code: key, keyCode });
      resolve(keyDown);
    }));
    return Promise.all(promises);
  }

  async navigateHome() {
    const button = await screen.findByRole('button', { name: 'Battle Menu' });
    return fireEvent.keyDown(button, { key: 'home', code: 'home', keyCode: '36' });
  }

  async navigateEnd() {
    const button = await screen.findByRole('button', { name: 'Battle Menu' });
    return fireEvent.keyDown(button, { key: 'end', code: 'end', keyCode: '35' });
  }

  async selectMenuItem(name) {
    const menu = await screen.findByRole('menu', { name: 'Battle Menu' });
    const item = await findByRole(menu, 'menuitem', { name });
    return this.user.click(item);
  }

  async selectMenuItemByKeyboard(name) {
    const menu = await screen.findByRole('menu', { name: 'Battle Menu' });
    const item = await findByRole(menu, 'menuitem', { name });
    return fireEvent.keyDown(item, { key: 'Enter', code: 'Enter', keyCode: 13 });
  }

  async loadBattle() {
    const file = new File(['hello'], 'battle.json', { type: 'application/json' });
    const input = screen.getByTestId('load-battle');
    return userEvent.upload(input, file);
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

  async assertMenuItemNotVisible(name) {
    const menu = await screen.findByRole('menu', { name: 'Battle Menu' });
    const item = queryByRole(menu, 'menuitem', { name });
    return expect(item).toBeNull();
  }

  async assertMenuItemsLength(length) {
    const menu = await screen.findByRole('menu', { name: 'Battle Menu' });
    const items = await findAllByRole(menu, 'menuitem');
    return expect(items).toHaveLength(length);
  }

  async assertMenuItemFocused(name) {
    const menu = await screen.findByRole('menu', { name: 'Battle Menu' });
    const item = await findByRole(menu, 'menuitem', { name });
    return expect(item).toHaveFocus();
  }

  async assertButtonFocused() {
    const button = await screen.findByRole('button', { name: 'Battle Menu' });
    return expect(button).toHaveFocus();
  }
}
