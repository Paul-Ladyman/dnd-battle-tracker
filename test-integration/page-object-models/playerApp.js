/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { screen } from '@testing-library/react';
import DndBattleTracker from './dndBattleTracker';
import PlayerAppWrapper from '../../src/components/app/PlayerAppWrapper';
import BattleMenu from './battleMenu';

export default class PlayerApp extends DndBattleTracker {
  constructor() {
    super(<PlayerAppWrapper battleId="random-battle-id" />);
    this.battleMenu = new BattleMenu(this.user);
  }

  static waitForOnline() {
    return screen.findByText('Player Session random-battle-id');
  }
}
