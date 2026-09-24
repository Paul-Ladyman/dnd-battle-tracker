import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import RecentBattlesDialog from './RecentBattlesDialog';

const battle = {
  savedAt: 1000,
  state: {
    creatures: [
      { name: 'Goblin' },
    ],
  },
};

function renderDialog(overrides = {}) {
  const props = {
    show: true,
    battles: [battle],
    onClose: jest.fn(),
    onRestore: jest.fn(),
    ...overrides,
  };

  render(
    <RecentBattlesDialog
      show={props.show}
      battles={props.battles}
      onClose={props.onClose}
      onRestore={props.onRestore}
    />,
  );
  return props;
}

describe('RecentBattlesDialog', () => {
  it('focuses the first restore button by default', () => {
    renderDialog();

    const restore = screen.getByRole('button', {
      name: 'Restore battle with 1 creature: Goblin',
    });
    expect(restore).toHaveFocus();
  });

  it('closes when escape is pressed', () => {
    const { onClose } = renderDialog();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('traps focus when tabbing forward from the close button', async () => {
    const user = userEvent.setup();
    renderDialog();

    const restore = screen.getByRole('button', {
      name: 'Restore battle with 1 creature: Goblin',
    });
    const close = screen.getByRole('button', { name: 'Close recent battles' });

    await user.tab();
    expect(close).toHaveFocus();

    await user.tab();
    expect(restore).toHaveFocus();
  });

  it('traps focus when tabbing backward from the first restore button', async () => {
    const user = userEvent.setup();
    renderDialog();

    const close = screen.getByRole('button', { name: 'Close recent battles' });

    await user.tab({ shift: true });

    expect(close).toHaveFocus();
  });

  it('restores the selected battle', async () => {
    const user = userEvent.setup();
    const { onRestore } = renderDialog();

    const restore = screen.getByRole('button', {
      name: 'Restore battle with 1 creature: Goblin',
    });
    await user.click(restore);

    expect(onRestore).toHaveBeenCalledWith(battle);
  });
});
