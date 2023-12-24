/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  queryByRole,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class ConditionsTool {
  constructor(user) {
    this.user = user;
  }

  async selectCondition(name, condition) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const conditionOption = queryByRole(toolMenu, 'checkbox', { name: condition });
    return this.user.click(conditionOption);
  }

  async selectConditionUsingKeyboard(name, condition) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const conditionOption = queryByRole(toolMenu, 'checkbox', { name: condition });
    return fireEvent.keyDown(conditionOption, { code: 'Space' });
  }

  async assertConditionAvailable(name, condition) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const conditionOption = queryByRole(toolMenu, 'checkbox', { name: condition });
    expect(conditionOption).toBeVisible();
  }

  async assertConditionInactive(name, condition) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const conditionOption = queryByRole(toolMenu, 'checkbox', { name: condition });
    expect(conditionOption).toHaveAttribute('aria-checked', 'false');
  }

  async assertConditionActive(name, condition) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const conditionOption = queryByRole(toolMenu, 'checkbox', { name: condition });
    expect(conditionOption).toHaveAttribute('aria-checked', 'true');
  }
}
