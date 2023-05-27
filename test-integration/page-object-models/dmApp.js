/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  screen,
  getByRole,
  queryByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import DndBattleTracker from './dndBattleTracker';
import DungeonMasterAppWrapper from '../../src/components/app/DungeonMasterAppWrapper';
import CreateCreatureForm from './createCreatureForm';
import CreatureToolbar from './creatureToolbar';
import MenuTool from './menuTool';
import StatusTool from './statusTool';

export default class DmApp extends DndBattleTracker {
  constructor() {
    super(<DungeonMasterAppWrapper />);
    this.createCreatureForm = new CreateCreatureForm(this.user);
    this.creatureToolbar = new CreatureToolbar(this.user);
    this.menuTool = new MenuTool(this.user);
    this.statusTool = new StatusTool(this.user);
  }

  async startBattle() {
    const banner = await screen.findByRole('banner');
    const startBattleButton = getByRole(banner, 'button', { name: 'Start battle' });
    return this.user.click(startBattleButton);
  }

  static async assertCreatureStatBlockLink(name) {
    const creature = await screen.findByRole('region', { name });

    const link = getByRole(creature, 'link', { name: 'Stat Block' });
    expect(link).toBeVisible();
    const expectedHref = `https://www.dndbeyond.com/monsters/${name.toLowerCase()}`;
    return expect(link).toHaveAttribute('href', expectedHref);
  }

  static async assertCreatureSearchLink(name) {
    const creature = await screen.findByRole('region', { name });

    const link = getByRole(creature, 'link', { name: `Search ${name} on D&D Beyond` });
    expect(link).toBeVisible();
    const expectedHref = `https://www.dndbeyond.com/monsters?filter-search=${name}&sort=cr`;
    return expect(link).toHaveAttribute('href', expectedHref);
  }

  static async assertNoCreatureSearchLink(name) {
    const creature = await screen.findByRole('region', { name });

    const link = queryByRole(creature, 'link', { name: `Search ${name} on D&D Beyond` });
    expect(link).toBeNull();
  }

  static async assertNoCreatureStatBlockLink(name) {
    const creature = await screen.findByRole('region', { name });

    const link = queryByRole(creature, 'link', { name: 'Stat Block' });
    expect(link).toBeNull();
  }
}
