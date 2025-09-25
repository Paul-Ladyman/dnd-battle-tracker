/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class StatusTool {
  constructor(user) {
    this.user = user;
  }

  findToolbar(name) {
    return screen.findByRole('toolbar', { name: `${name} toolbar` });
  }

  async assertPressed(name) {
    const toolbar = await this.findToolbar(name);
    const statusTool = await findByRole(toolbar, 'button', { name: 'Stabilize' });
    expect(statusTool).toBeVisible();
    expect(statusTool).toHaveAttribute('aria-pressed', 'true');
  }

  async assertNotPressed(name) {
    const toolbar = await this.findToolbar(name);
    const statusTool = await findByRole(toolbar, 'button', { name: 'Kill' });
    expect(statusTool).toBeVisible();
    expect(statusTool).toHaveAttribute('aria-pressed', 'false');
  }
}
