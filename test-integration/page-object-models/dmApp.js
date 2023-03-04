/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  screen,
  getByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import DndBattleTracker from './dndBattleTracker';
import DungeonMasterAppWrapper from '../../src/components/app/DungeonMasterAppWrapper';
import CreateCreatureForm from './createCreatureForm';
import CreatureToolbar from './creatureToolbar';

export default class DmApp extends DndBattleTracker {
  constructor() {
    super(<DungeonMasterAppWrapper />);
    this.createCreatureForm = new CreateCreatureForm(this.user);
    this.creatureToolbar = new CreatureToolbar(this.user);
  }

  async startBattle() {
    const banner = await screen.findByRole('banner');
    const startBattleButton = getByRole(banner, 'button', { name: 'Start battle' });
    return this.user.click(startBattleButton);
  }
}
