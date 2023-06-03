/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class ConditionsTool {
  constructor(user) {
    this.user = user;
  }

  async openConditions(name) {
    const conditionsTool = await screen.findByRole('combobox', { name: `add condition to ${name}` });
    return this.user.click(conditionsTool);
  }

  async addCondition(name, condition) {
    const conditionsTool = await screen.findByRole('combobox', { name: `add condition to ${name}` });
    return this.user.selectOptions(conditionsTool, condition);
  }

  async assertConditionAvailable(name, condition) {
    const conditionsTool = await screen.findByRole('combobox', { name: `add condition to ${name}` });
    await this.user.click(conditionsTool);
    const conditionOption = screen.queryByRole('option', { name: condition });
    expect(conditionOption).toBeVisible();
  }

  async assertConditionNotAvailable(name, condition) {
    const conditionsTool = await screen.findByRole('combobox', { name: `add condition to ${name}` });
    await this.user.click(conditionsTool);
    const conditionOption = screen.queryByRole('option', { name: condition });
    expect(conditionOption).toBeNull();
  }
}
