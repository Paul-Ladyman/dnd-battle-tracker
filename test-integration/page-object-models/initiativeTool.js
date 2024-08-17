/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByText,
  findByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class InitiativeTool {
  constructor(user) {
    this.user = user;
  }

  async setCreatureInitiative(name, initiative) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const initiativeTool = await findByText(toolMenu, 'Initiative');
    await this.user.type(initiativeTool, initiative);
    const submitButton = await findByRole(toolMenu, 'button', { name: 'Add Initiative' });
    return this.user.click(submitButton);
  }

  async setTieBreaker(name, tieBreaker) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tieBreakerTool = await findByText(toolMenu, 'Tie Breaker');
    await this.user.type(tieBreakerTool, tieBreaker);
    const submitButton = await findByRole(toolMenu, 'button', { name: 'Add Tie Breaker' });
    return this.user.click(submitButton);
  }

  async assertDisabled(name) {
    const toolbar = await screen.findByRole('toolbar', { name: `${name} toolbar` });
    const toolbarButton = await findByRole(toolbar, 'button', { name: 'Initiative' });
    expect(toolbarButton).toHaveAttribute('aria-disabled', 'true');
  }
}
