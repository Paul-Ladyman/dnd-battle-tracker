/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  getByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class BattleToolbar {
  constructor(user) {
    this.user = user;
  }

  async startBattle() {
    const battleToolbar = await screen.findByRole('banner');
    const startBattleButton = getByRole(battleToolbar, 'button', { name: 'Start battle' });
    return this.user.click(startBattleButton);
  }

  async nextTurn() {
    const battleToolbar = await screen.findByRole('banner');
    const nextTurnButton = getByRole(battleToolbar, 'button', { name: 'Next turn' });
    return this.user.click(nextTurnButton);
  }

  async advanceTurns(turns) {
    const advances = Array(turns).fill().map(() => this.nextTurn());
    return Promise.all(advances);
  }

  async assertTimeElapsed(time) {
    const battleToolbar = await screen.findByRole('banner');
    const timeElapsed = getByRole(battleToolbar, 'region', { name: 'time elapsed' });
    return expect(timeElapsed).toHaveTextContent(`Time Elapsed:${time}`);
  }

  async assertStartBattleDisabled() {
    const battleToolbar = await screen.findByRole('banner');
    const startBattleButton = getByRole(battleToolbar, 'button', { name: 'Start battle' });
    return expect(startBattleButton).toHaveAttribute('aria-disabled', 'true');
  }
}
