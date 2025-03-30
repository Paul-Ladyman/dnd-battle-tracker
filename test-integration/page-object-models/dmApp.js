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
import SpellcastingTool from './spellcastingTool';
import BattleToolbar from './battleToolbar';
import AcTool from './acTool';
import Navigation from './navigation';
import Alert from './alert';

function TestDmApp() {
  return <DungeonMasterAppWrapper />;
}

export default class DmApp extends DndBattleTracker {
  constructor() {
    super(<TestDmApp />);
    this.createCreatureForm = new CreateCreatureForm(this.user);
    this.creatureToolbar = new CreatureToolbar(this.user);
    this.menuTool = new MenuTool(this.user);
    this.statusTool = new StatusTool(this.user);
    this.hpTool = new HpTool(this.user);
    this.acTool = new AcTool(this.user);
    this.initiativeTool = new InitiativeTool(this.user);
    this.conditionsTool = new ConditionsTool(this.user);
    this.spellcastingTool = new SpellcastingTool(this.user);
    this.battleToolbar = new BattleToolbar(this.user);
    this.navigation = new Navigation(this.user);
    this.alert = new Alert(this.user);
  }
}
