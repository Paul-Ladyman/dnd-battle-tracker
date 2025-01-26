/* eslint-disable no-return-assign */
import {
  getByRole,
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import isHotkey from 'is-hotkey';
import AlertDialog from './AlertDialog';

jest.mock('is-hotkey');

describe('AlertDialog', () => {
  it('is hidden by default', () => {
    render(<AlertDialog />);
    const alertDialog = screen.queryByRole('alertdialog');
    expect(alertDialog).toBeNull();
  });

  it('shows an alert dialog to the user', () => {
    render(<AlertDialog show />);
    const alertDialog = screen.getByRole('alertdialog');
    expect(alertDialog).toBeVisible();
  });

  it('shows a message to the user', () => {
    render(<AlertDialog show message="message" />);
    const alertDialog = screen.getByRole('alertdialog');
    expect(alertDialog).toHaveTextContent('message');
  });

  it('focuses the no button by default', () => {
    render(<AlertDialog show />);
    const alertDialog = screen.getByRole('alertdialog');
    const no = getByRole(alertDialog, 'button', { name: 'No' });
    expect(no).toHaveFocus();
  });

  it('traps focus when tabbing forward to no', async () => {
    const user = userEvent.setup();
    render(<AlertDialog show />);
    const alertDialog = screen.getByRole('alertdialog');
    await user.click(alertDialog);
    await user.tab();
    const no = getByRole(alertDialog, 'button', { name: 'No' });
    expect(no).toHaveFocus();
  });

  it('traps focus when tabbing backward to yes', async () => {
    const user = userEvent.setup();
    function Test() {
      return (
        <>
          <AlertDialog show />
          <button type="button">test</button>
        </>
      );
    }
    isHotkey.mockReturnValue(true);
    render(<Test />);
    const alertDialog = screen.getByRole('alertdialog');
    await user.click(alertDialog);
    await user.tab({ shift: true });
    const yes = getByRole(alertDialog, 'button', { name: 'Yes' });
    expect(yes).toHaveFocus();
  });

  it('traps focus when tabbing forward from no to yes', async () => {
    const user = userEvent.setup();
    render(<AlertDialog show />);
    await user.tab();
    const alertDialog = screen.getByRole('alertdialog');
    const yes = getByRole(alertDialog, 'button', { name: 'Yes' });
    expect(yes).toHaveFocus();
  });

  it('traps focus when tabbing backward from no to yes', async () => {
    const user = userEvent.setup();
    render(<AlertDialog show />);
    await user.tab({ shift: true });
    const alertDialog = screen.getByRole('alertdialog');
    const yes = getByRole(alertDialog, 'button', { name: 'Yes' });
    expect(yes).toHaveFocus();
  });

  it('traps focus when tabbing forward from yes to no', async () => {
    const user = userEvent.setup();
    render(<AlertDialog show />);
    await user.tab();
    await user.tab();
    const alertDialog = screen.getByRole('alertdialog');
    const no = getByRole(alertDialog, 'button', { name: 'No' });
    expect(no).toHaveFocus();
  });

  it('traps focus when tabbing backward from yes to no', async () => {
    const user = userEvent.setup();
    render(<AlertDialog show />);
    await user.tab();
    await user.tab({ shift: true });
    const alertDialog = screen.getByRole('alertdialog');
    const no = getByRole(alertDialog, 'button', { name: 'No' });
    expect(no).toHaveFocus();
  });

  it('calls onNo when the no button is clicked', async () => {
    const onNo = jest.fn();
    const user = userEvent.setup();
    render(<AlertDialog show onNo={onNo} />);
    const alertDialog = screen.getByRole('alertdialog');
    const no = getByRole(alertDialog, 'button', { name: 'No' });
    await user.click(no);
    expect(onNo).toHaveBeenCalled();
  });

  it('calls onNo when escape is pressed', async () => {
    const onNo = jest.fn();
    render(<AlertDialog show onNo={onNo} />);
    const alertDialog = screen.getByRole('alertdialog');
    fireEvent.keyUp(alertDialog, { key: 'esc', keyCode: 27 });
    expect(onNo).toHaveBeenCalled();
  });

  it('calls onYes when the yes button is clicked', async () => {
    const onYes = jest.fn();
    const user = userEvent.setup();
    render(<AlertDialog show onYes={onYes} />);
    const alertDialog = screen.getByRole('alertdialog');
    const yes = getByRole(alertDialog, 'button', { name: 'Yes' });
    await user.click(yes);
    expect(onYes).toHaveBeenCalled();
  });
});
