/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  fireEvent,
  getByRole,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class Alert {
  constructor(user) {
    this.user = user;
  }

  async clickYes() {
    const dialog = await screen.findByRole('alertdialog');
    const yes = getByRole(dialog, 'button', { name: 'Yes' });
    return this.user.click(yes);
  }

  async clickNo() {
    const dialog = await screen.findByRole('alertdialog');
    const no = getByRole(dialog, 'button', { name: 'No' });
    return this.user.click(no);
  }

  async close() {
    const dialog = await screen.findByRole('alertdialog');
    const no = getByRole(dialog, 'button', { name: 'No' });
    return fireEvent.keyUp(no, { key: 'esc', keyCode: 27 });
  }

  async assertMessage(message) {
    const dialog = await screen.findByRole('alertdialog');
    return expect(dialog).toHaveTextContent(message);
  }

  async assertNotVisible() {
    const dialog = screen.queryByRole('alertdialog');
    return expect(dialog).toBeNull();
  }
}
