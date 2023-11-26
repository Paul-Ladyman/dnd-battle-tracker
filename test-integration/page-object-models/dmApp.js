/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
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
import SpellSlotsTool from './spellSlotsTool';
import Creature from './creature';
import BattleToolbar from './battleToolbar';

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
    this.spellSlotsTool = new SpellSlotsTool(this.user);
    this.creature = new Creature(this.user);
    this.battleToolbar = new BattleToolbar(this.user);
  }
}
