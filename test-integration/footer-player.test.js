import React from 'react';
import { findByRole, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import PlayerAppWrapper from '../src/components/app/PlayerAppWrapper';

describe('Keyboard shortcuts', () => {
  test('the keyboard shortcuts button is not expanded by default', async () => {
    render(<PlayerAppWrapper />);
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('the keyboard shortcuts are hidden by default', async () => {
    render(<PlayerAppWrapper />);
    const shortcuts = await screen.findByTestId('keyboard-shortcuts');
    expect(shortcuts).toBeInTheDocument();
    expect(shortcuts).toHaveStyle({ display: 'none' });
  });

  test('the keyboard shortcuts button is expanded when clicked', async () => {
    render(<PlayerAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  test('the keyboard shortcuts are displayed as a list', async () => {
    render(<PlayerAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    const shortcuts = await screen.findByTestId('keyboard-shortcuts');
    const list = await findByRole(shortcuts, 'list');
    expect(list).toBeInTheDocument();
    expect(list.childNodes.length).toBeGreaterThan(0);
  });

  test('the keyboard shortcuts are displayed when the button is clicked', async () => {
    render(<PlayerAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    const shortcuts = await screen.findByTestId('keyboard-shortcuts');
    expect(shortcuts).toBeInTheDocument();
    expect(shortcuts).toHaveStyle({ display: 'block' });
  });

  test('the keyboard shortcuts button is not expanded when clicked again', async () => {
    render(<PlayerAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('the keyboard shortcuts are hidden when the button is clicked', async () => {
    render(<PlayerAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    await user.click(button);
    const shortcuts = await screen.findByTestId('keyboard-shortcuts');
    expect(shortcuts).toBeInTheDocument();
    expect(shortcuts).toHaveStyle({ display: 'none' });
  });
});
