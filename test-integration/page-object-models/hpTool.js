/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByText,
  findByRole
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class HpTool {
  constructor(user) {
    this.user = user;
  }

  async damageCreature(name, damage) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const damageHealTool = await findByText(toolMenu, 'Damage/Heal');
    await this.user.type(damageHealTool, damage);
    const damageButton = await findByRole(toolMenu, 'button', { name: 'Damage' });
    return this.user.click(damageButton);
  }

  async healCreature(name, hp) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const damageHealTool = await findByText(toolMenu, 'Damage/Heal');
    await this.user.type(damageHealTool, hp);
    const healButton = await findByRole(toolMenu, 'button', { name: 'Heal' });
    return this.user.click(healButton);
  }

  async assertDamageDisabled(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const damageButton = await findByRole(toolMenu, 'button', { name: 'Damage' });
    expect(damageButton).toBeDisabled();
  }

  async assertHealDisabled(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const healButton = await findByRole(toolMenu, 'button', { name: 'Heal' });
    expect(healButton).toBeDisabled();
  }
}
