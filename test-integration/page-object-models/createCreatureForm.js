/* eslint-disable import/no-extraneous-dependencies */
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';

export default class CreateCreatureForm {
  constructor(user) {
    this.user = user;
  }

  async submitCreature() {
    const add = await screen.findByRole('button', { name: 'Add creature' });
    return this.user.click(add);
  }

  async enterCreatureName(name) {
    const nameField = await screen.findByText('Creature Name');
    return this.user.type(nameField, name);
  }

  async addCreature(name, initiative, hp, multiply) {
    await this.enterCreatureName(name);

    if (initiative) {
      const initiativeField = await screen.findByText('Initiative (optional)');
      await this.user.type(initiativeField, initiative);
    }

    if (hp) {
      const hpField = await screen.findByText('HP (optional)');
      await this.user.type(hpField, hp);
    }

    if (multiply) {
      const multiplyField = await screen.findByText('Multiply');
      await this.user.type(multiplyField, '{delete}');
      await this.user.type(multiplyField, multiply);
    }

    return this.submitCreature();
  }

  async addCreatureWithRolledInitiative(name, hp, multiply) {
    const rollInitiative = await screen.findByRole('button', { name: 'Roll Initiative' });
    await this.user.click(rollInitiative);
    return this.addCreature(name, null, hp, multiply);
  }

  static async assertCreateCreatureSearch(name) {
    const search = await screen.findByRole('link', { name: `Search ${name} on D&D Beyond` });
    expect(search).toBeVisible();
    const expectedHref = `https://www.dndbeyond.com/monsters?filter-search=${name}&sort=cr`;
    return expect(search).toHaveAttribute('href', expectedHref);
  }
}
