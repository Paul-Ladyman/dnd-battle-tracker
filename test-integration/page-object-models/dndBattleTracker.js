/* eslint-disable import/no-extraneous-dependencies */
import { render, screen, getByText, getByRole } from '@testing-library/react';
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

  static async assertCreatureVisible(name, hp) {
    const creature = await screen.findByRole('region', { name });

    if (hp) {
      const hpValue = getByText(creature, `HP ${hp}`);
      expect(hpValue).toBeVisible();
    }

    return expect(creature).toBeVisible();
  }

  static async assertError(message) {
    const errorBar = await screen.findByRole('alert');
    return expect(errorBar).toHaveTextContent(message);
  }
}
