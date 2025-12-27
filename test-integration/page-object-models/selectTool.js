/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class SelectTool {
  constructor(user) {
    this.user = user;
  }

  findToolbar(name) {
    return screen.findByRole('toolbar', { name: `${name} toolbar` });
  }

  async assertPressed(name) {
    const toolbar = await this.findToolbar(name);
    const selectTool = await findByRole(toolbar, 'button', { name: 'Unselect' });
    expect(selectTool).toBeVisible();
    expect(selectTool).toHaveAttribute('aria-pressed', 'true');
  }

  async assertNotPressed(name) {
    const toolbar = await this.findToolbar(name);
    const selectTool = await findByRole(toolbar, 'button', { name: 'Select' });
    expect(selectTool).toBeVisible();
    expect(selectTool).toHaveAttribute('aria-pressed', 'false');
  }
}
