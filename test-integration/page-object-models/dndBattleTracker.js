/* eslint-disable import/no-extraneous-dependencies */
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export default class DndBattleTracker {
  constructor(component) {
    render(component);
    this.user = userEvent.setup();
  }
}
