/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByText,
  findByRole,
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

  async setCreatureMaxHp(name, hp) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const maxHpTool = await findByText(toolMenu, 'Max HP');
    await this.user.type(maxHpTool, hp);
    const submitButton = await findByRole(toolMenu, 'button', { name: 'Add/Edit Max HP' });
    return this.user.click(submitButton);
  }

  async setCreatureTempHp(name, hp) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tempHpTool = await findByText(toolMenu, 'Temp HP');
    await this.user.type(tempHpTool, hp);
    const submitButton = await findByRole(toolMenu, 'button', { name: 'Add/Edit Temp HP' });
    return this.user.click(submitButton);
  }

  async assertDamageDisabled(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const damageButton = await findByRole(toolMenu, 'button', { name: 'Damage' });
    expect(damageButton).toHaveAttribute('aria-disabled', 'true');
  }

  async assertHealDisabled(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const healButton = await findByRole(toolMenu, 'button', { name: 'Heal' });
    expect(healButton).toHaveAttribute('aria-disabled', 'true');
  }

  async assertTempHpDisabled(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const tempHpButton = await findByRole(toolMenu, 'button', { name: 'Add/Edit Temp HP' });
    expect(tempHpButton).toHaveAttribute('aria-disabled', 'true');
  }
}
