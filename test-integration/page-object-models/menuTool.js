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

  async shareCreature(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const shareTool = await findByRole(toolMenu, 'button', { name: `Share ${name}` });
    return this.user.click(shareTool);
  }

  async unshareCreature(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const shareTool = await findByRole(toolMenu, 'button', { name: `Unshare ${name}` });
    return this.user.click(shareTool);
  }

  async shareHP(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const shareTool = await findByRole(toolMenu, 'button', { name: `Share ${name} HP` });
    return this.user.click(shareTool);
  }

  async unshareHP(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const shareTool = await findByRole(toolMenu, 'button', { name: `Unshare ${name} HP` });
    return this.user.click(shareTool);
  }

  async removeCreature(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const removeTool = await findByRole(toolMenu, 'button', { name: `remove ${name}` });
    return this.user.click(removeTool);
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

  async assertCreatureNotShared(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const shareTool = await findByRole(toolMenu, 'button', { name: `Share ${name}` });
    expect(shareTool).toBeVisible();
    expect(shareTool).toHaveAttribute('aria-pressed', 'false');
  }

  async assertCreatureShared(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const shareTool = await findByRole(toolMenu, 'button', { name: `Unshare ${name}` });
    expect(shareTool).toBeVisible();
    expect(shareTool).toHaveAttribute('aria-pressed', 'true');
  }

  async assertHPNotShared(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const shareTool = await findByRole(toolMenu, 'button', { name: `Share ${name} HP` });
    expect(shareTool).toBeVisible();
    expect(shareTool).toHaveAttribute('aria-pressed', 'false');
  }

  async assertHPShared(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const shareTool = await findByRole(toolMenu, 'button', { name: `Unshare ${name} HP` });
    expect(shareTool).toBeVisible();
    expect(shareTool).toHaveAttribute('aria-pressed', 'true');
  }

  async assertCreatureShareDisabled(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const shareTool = await findByRole(toolMenu, 'button', { name: `Unshare ${name}` });
    expect(shareTool).toHaveAttribute('aria-disabled', 'true');
  }

  async assertCreatureShareEnabled(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const shareTool = await findByRole(toolMenu, 'button', { name: `Share ${name}` });
    expect(shareTool).toHaveAttribute('aria-disabled', 'false');
  }

  async assertRemoveCreatureDisabled(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const removeTool = await findByRole(toolMenu, 'button', { name: `remove ${name}` });
    expect(removeTool).toHaveAttribute('aria-disabled', 'true');
  }

  async assertRemoveCreatureFocused(name) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });

    const removeTool = await findByRole(toolMenu, 'button', { name: `remove ${name}` });
    expect(removeTool).toHaveFocus();
  }
}
