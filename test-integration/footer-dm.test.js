import React from 'react';
import {
  findByRole,
  findByText,
  queryByText,
  render,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DungeonMasterAppWrapper from '../src/components/app/DungeonMasterAppWrapper';
import packageInfo from '../package.json';

describe('Keyboard shortcuts', () => {
  test('the keyboard shortcuts button is not expanded by default', async () => {
    render(<DungeonMasterAppWrapper />);
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('the keyboard shortcuts are hidden by default', async () => {
    render(<DungeonMasterAppWrapper />);
    const shortcuts = await screen.findByTestId('keyboard-shortcuts');
    expect(shortcuts).toBeInTheDocument();
    expect(shortcuts).toHaveStyle({ display: 'none' });
  });

  test('the keyboard shortcuts button is expanded when clicked', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  test('the keyboard shortcuts are displayed as a list', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    const shortcuts = await screen.findByTestId('keyboard-shortcuts');
    const list = await findByRole(shortcuts, 'list');
    expect(list).toBeInTheDocument();
    expect(list.childNodes.length).toBeGreaterThan(0);
  });

  test('the keyboard shortcuts are displayed when the button is clicked', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    const shortcuts = await screen.findByTestId('keyboard-shortcuts');
    expect(shortcuts).toBeInTheDocument();
    expect(shortcuts).toHaveStyle({ display: 'block' });
  });

  test('the keyboard shortcuts button is not expanded when clicked again', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('the keyboard shortcuts are hidden when the button is clicked', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    await user.click(button);
    const shortcuts = await screen.findByTestId('keyboard-shortcuts');
    expect(shortcuts).toBeInTheDocument();
    expect(shortcuts).toHaveStyle({ display: 'none' });
  });
});

describe('Info', () => {
  test('the info button is not expanded by default', async () => {
    render(<DungeonMasterAppWrapper />);
    const button = await screen.findByRole('button', { name: 'Info' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('the info section is hidden by default', async () => {
    render(<DungeonMasterAppWrapper />);
    const info = await screen.findByTestId('info');
    expect(info).toBeInTheDocument();
    expect(info).toHaveStyle({ display: 'none' });
  });

  test('the info button is expanded when clicked', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Info' });
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  test('the info section is displayed when the button is clicked', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Info' });
    await user.click(button);
    const info = await screen.findByTestId('info');
    expect(info).toBeInTheDocument();
    expect(info).toHaveStyle({ display: 'block' });
  });

  test('the info button is not expanded when clicked again', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Info' });
    await user.click(button);
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('the info section is hidden when the button is clicked', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Info' });
    await user.click(button);
    await user.click(button);
    const info = await screen.findByTestId('info');
    expect(info).toBeInTheDocument();
    expect(info).toHaveStyle({ display: 'none' });
  });

  test('displays only version details if build time is not set', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Info' });
    await user.click(button);
    const info = await screen.findByTestId('info');

    const { version } = packageInfo;
    const versionDetails = await findByText(info, new RegExp(`Version ${version}`));
    expect(versionDetails).toBeVisible();

    const buildTime = queryByText(info, /built at/);
    expect(buildTime).not.toBeInTheDocument();
  });

  test('displays only version details if build time is invalid', async () => {
    window.BUILD_TIME = 'invalid';
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Info' });
    await user.click(button);
    const info = await screen.findByTestId('info');

    const { version } = packageInfo;
    const versionDetails = await findByText(info, new RegExp(`Version ${version}`));
    expect(versionDetails).toBeVisible();

    const buildTime = queryByText(info, /built at/);
    expect(buildTime).not.toBeInTheDocument();
  });

  test('displays full build details in UTC if build time is set', async () => {
    window.BUILD_TIME = '1657373230123';
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Info' });
    await user.click(button);
    const info = await screen.findByTestId('info');

    const { version } = packageInfo;
    const expectedDetails = new RegExp(`Version ${version} built at 2022-07-09, 13:27:10.123`);
    const details = await findByText(info, expectedDetails);
    expect(details).toBeVisible();
  });
});
