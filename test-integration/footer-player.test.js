import {
  findByRole,
  findByText,
  queryByText,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import packageInfo from '../package.json';
import PlayerApp from './page-object-models/playerApp';

describe('Keyboard shortcuts', () => {
  test('the keyboard shortcuts button is not expanded by default', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('the keyboard shortcuts are hidden by default', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const shortcuts = await screen.findByTestId('keyboard-shortcuts');
    expect(shortcuts).toBeInTheDocument();
    expect(shortcuts).toHaveStyle({ display: 'none' });
  });

  test('the keyboard shortcuts button is expanded when clicked', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  test('the keyboard shortcuts are displayed as a list', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    const shortcuts = await screen.findByTestId('keyboard-shortcuts');
    const list = await findByRole(shortcuts, 'list');
    expect(list).toBeInTheDocument();
    expect(list.childNodes.length).toBeGreaterThan(0);
  });

  test('the keyboard shortcuts are displayed when the button is clicked', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    const shortcuts = await screen.findByTestId('keyboard-shortcuts');
    expect(shortcuts).toBeInTheDocument();
    expect(shortcuts).toHaveStyle({ display: 'block' });
  });

  test('the keyboard shortcuts button is not expanded when clicked again', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Keyboard shortcuts' });
    await user.click(button);
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('the keyboard shortcuts are hidden when the button is clicked', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
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
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const button = await screen.findByRole('button', { name: 'Info' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('the info section is hidden by default', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const info = await screen.findByTestId('info');
    expect(info).toBeInTheDocument();
    expect(info).toHaveStyle({ display: 'none' });
  });

  test('the info button is expanded when clicked', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Info' });
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  test('the info section is displayed when the button is clicked', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Info' });
    await user.click(button);
    const info = await screen.findByTestId('info');
    expect(info).toBeInTheDocument();
    expect(info).toHaveStyle({ display: 'block' });
  });

  test('the info button is not expanded when clicked again', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Info' });
    await user.click(button);
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('the info section is hidden when the button is clicked', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const user = userEvent.setup();
    const button = await screen.findByRole('button', { name: 'Info' });
    await user.click(button);
    await user.click(button);
    const info = await screen.findByTestId('info');
    expect(info).toBeInTheDocument();
    expect(info).toHaveStyle({ display: 'none' });
  });

  test('displays only version details if build time is not set', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
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
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
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
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
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

describe('DM tips', () => {
  test('the dm tips are not displayed', async () => {
    const _ = new PlayerApp();
    await PlayerApp.waitForOnline();
    const button = await screen.queryByRole('button', { name: 'Dungeon Master tips' });
    expect(button).not.toBeInTheDocument();
    const tips = await screen.queryByTestId('dm-tips');
    expect(tips).not.toBeInTheDocument();
  });
});
