/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  getByRole,
  queryByRole,
  findByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class MenuTool {
  constructor(user) {
    this.user = user;
  }

  async lockCreature(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const lockTool = await findByRole(toolMenu, 'button', { name: `Lock ${name}` });
    return this.user.click(lockTool);
  }

  async unlockCreature(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const lockTool = await findByRole(toolMenu, 'button', { name: `Unlock ${name}` });
    return this.user.click(lockTool);
  }

  async assertCreatureStatBlockLink(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const link = getByRole(toolMenu, 'link', { name: 'Stat Block' });
    expect(link).toBeVisible();
    const expectedHref = `https://www.dndbeyond.com/monsters/${name.toLowerCase()}`;
    return expect(link).toHaveAttribute('href', expectedHref);
  }

  async assertCreatureSearchLink(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const link = getByRole(toolMenu, 'link', { name: `Search ${name} on D&D Beyond` });
    expect(link).toBeVisible();
    const expectedHref = `https://www.dndbeyond.com/monsters?filter-search=${name}&sort=cr`;
    return expect(link).toHaveAttribute('href', expectedHref);
  }

  async assertNoCreatureSearchLink(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const link = queryByRole(toolMenu, 'link', { name: `Search ${name} on D&D Beyond` });
    expect(link).toBeNull();
  }

  async assertNoCreatureStatBlockLink(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const link = queryByRole(toolMenu, 'link', { name: 'Stat Block' });
    expect(link).toBeNull();
  }

  async assertCreatureUnlocked(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const lockTool = await findByRole(toolMenu, 'button', { name: `Lock ${name}` });
    expect(lockTool).toBeVisible();
    expect(lockTool).toHaveAttribute('aria-pressed', 'false');
  }

  async assertCreatureLocked(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const lockTool = await findByRole(toolMenu, 'button', { name: `Unlock ${name}` });
    expect(lockTool).toBeVisible();
    expect(lockTool).toHaveAttribute('aria-pressed', 'true');
  }
}
