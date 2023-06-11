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
import HpTool from './hpTool';
import InitiativeTool from './initiativeTool';
import ConditionsTool from './conditionsTool';

export default class DmApp extends DndBattleTracker {
  constructor() {
    super(<DungeonMasterAppWrapper />);
    this.createCreatureForm = new CreateCreatureForm(this.user);
    this.creatureToolbar = new CreatureToolbar(this.user);
    this.menuTool = new MenuTool(this.user);
    this.statusTool = new StatusTool(this.user);
    this.hpTool = new HpTool(this.user);
    this.initiativeTool = new InitiativeTool(this.user);
    this.conditionsTool = new ConditionsTool(this.user);
  }

  async startBattle() {
    const banner = await screen.findByRole('banner');
    const startBattleButton = getByRole(banner, 'button', { name: 'Start battle' });
    return this.user.click(startBattleButton);
  }
}
