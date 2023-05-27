/* eslint-disable import/no-extraneous-dependencies */
import {
  render,
  screen,
  getByText,
  getByRole,
  findByRole,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export default class DndBattleTracker {
  constructor(component) {
    render(component);
    this.user = userEvent.setup();
  }

  static async assertCreatureList(expectedCreatureNames) {
    const creatures = await screen.findAllByRole('region');
    const creatureNames = creatures.map((creature) => getByRole(creature, 'heading').textContent);
    return expect(creatureNames).toEqual(expectedCreatureNames);
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
      return expect(currentTurnButton).toBeEnabled();
    }
    return expect(currentTurnButton).toBeDisabled();
  }
}
