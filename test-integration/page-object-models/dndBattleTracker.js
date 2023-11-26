/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  render,
  screen,
  getByText,
  getByRole,
  findByRole,
  findAllByRole,
  queryAllByRole,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RulesSearchBar from './rulesSearchBar';
import BattleMenu from './battleMenu';

export default class DndBattleTracker {
  constructor(component) {
    this.user = userEvent.setup();
    this.rulesSearchBar = new RulesSearchBar(this.user);
    this.battleMenu = new BattleMenu(this.user);
    render(component);
  }

  static async assertCreatureList(expectedCreatureNames) {
    const main = await screen.findByRole('main');
    const creatures = await findAllByRole(main, 'region');
    const creatureNames = creatures.map((creature) => getByRole(creature, 'heading').textContent);
    return expect(creatureNames).toEqual(expectedCreatureNames);
  }

  async assertCreatureListEmpty() {
    const main = await screen.findByRole('main');
    const creatures = await queryAllByRole(main, 'region');
    return expect(creatures).toHaveLength(0);
  }

  static async assertCreatureVisible(name, hp, ac, note) {
    const creature = await screen.findByRole('region', { name });

    if (hp) {
      const hpValue = getByText(creature, `HP ${hp}`);
      expect(hpValue).toBeVisible();
    }

    if (ac) {
      const acValue = getByText(creature, `AC ${ac}`);
      expect(acValue).toBeVisible();
    }

    if (note) {
      const noteValue = getByText(creature, note);
      expect(noteValue).toBeVisible();
    }

    return expect(creature).toBeVisible();
  }

  static async assertError(message) {
    const errorBar = await screen.findByRole('alert');
    return expect(errorBar).toHaveTextContent(message);
  }

  static async assertCurrentTurn(enabled, name) {
    const banner = await screen.findByRole('banner');
    const currentTurnButton = await findByRole(banner, 'button', { name });
    expect(currentTurnButton).toBeVisible();
    expect(currentTurnButton).toHaveTextContent(name);
    if (enabled) {
      return expect(currentTurnButton).toHaveAttribute('aria-disabled', 'false');
    }
    return expect(currentTurnButton).toHaveAttribute('aria-disabled', 'true');
  }
}
