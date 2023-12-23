/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-extraneous-dependencies */
import {
  screen,
  findByText,
  findByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom';

export default class AcTool {
  constructor(user) {
    this.user = user;
  }

  async setCreatureAc(name, ac) {
    const toolMenu = screen.queryByRole('menu', { name: `${name} tool menu` });
    const acTool = await findByText(toolMenu, 'Armor Class');
    await this.user.type(acTool, ac);
    const acButton = await findByRole(toolMenu, 'button', { name: 'Add/Edit AC' });
    return this.user.click(acButton);
  }
}
