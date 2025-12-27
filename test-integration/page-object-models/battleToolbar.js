/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  getByRole,
  queryByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class BattleToolbar {
  constructor(user) {
    this.user = user;
  }

  async unselectAll() {
    const battleToolbar = await screen.findByRole('banner');
    const unselectAllButton = getByRole(battleToolbar, 'button', { name: 'Unselect all' });
    return this.user.click(unselectAllButton);
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

  async assertSelectedCreatures(number) {
    const battleToolbar = await screen.findByRole('banner');
    const selectedCreatures = getByRole(battleToolbar, 'region', { name: 'selected creatures' });
    return expect(selectedCreatures).toHaveTextContent(`Selected Creatures:${number}`);
  }

  async assertNoSelectedCreatures() {
    const battleToolbar = await screen.findByRole('banner');
    const selectedCreatures = queryByRole(battleToolbar, 'region', { name: 'selected creatures' });
    return expect(selectedCreatures).toBeNull();
  }

  async assertNoStats() {
    const battleToolbar = await screen.findByRole('banner');
    const turn = queryByRole(battleToolbar, 'region', { name: 'turn' });
    expect(turn).toBeNull();
    const creatures = queryByRole(battleToolbar, 'region', { name: 'creatures' });
    expect(creatures).toBeNull();
    const round = queryByRole(battleToolbar, 'region', { name: 'round' });
    expect(round).toBeNull();
    const timeElapsed = queryByRole(battleToolbar, 'region', { name: 'time elapsed' });
    return expect(timeElapsed).toBeNull();
  }

  async assertNoStartBattle() {
    const battleToolbar = await screen.findByRole('banner');
    const startBattleButton = queryByRole(battleToolbar, 'button', { name: 'Start battle' });
    return expect(startBattleButton).toBeNull();
  }

  async assertNoUnselectAll() {
    const battleToolbar = await screen.findByRole('banner');
    const unselectAllButton = queryByRole(battleToolbar, 'button', { name: 'Unselect all' });
    return expect(unselectAllButton).toBeNull();
  }

  async assertStartBattleDisabled() {
    const battleToolbar = await screen.findByRole('banner');
    const startBattleButton = getByRole(battleToolbar, 'button', { name: 'Start battle' });
    return expect(startBattleButton).toHaveAttribute('aria-disabled', 'true');
  }
}
