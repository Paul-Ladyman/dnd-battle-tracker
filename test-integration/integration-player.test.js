import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PlayerAppWrapper from '../src/components/app/PlayerAppWrapper';
import packageInfo from '../package.json';

describe('Player App', () => {
  test('displays application title', async () => {
    render(<PlayerAppWrapper />);
    const title = await screen.findByText('D&D Battle Tracker');
    expect(title).toBeVisible();
  });

  test('displays only version details if build time is not set', async () => {
    render(<PlayerAppWrapper />);
    const { version } = packageInfo;
    const versionDetails = await screen.findByText(new RegExp(`Version ${version}`));
    expect(versionDetails).toBeVisible();

    const buildTime = screen.queryByText(/built at/);
    expect(buildTime).not.toBeInTheDocument();
  });

  test('displays only version details if build time is invalid', async () => {
    window.BUILD_TIME = 'invalid';
    render(<PlayerAppWrapper />);
    const { version } = packageInfo;
    const versionDetails = await screen.findByText(new RegExp(`Version ${version}`));
    expect(versionDetails).toBeVisible();

    const buildTime = screen.queryByText(/built at/);
    expect(buildTime).not.toBeInTheDocument();
  });

  test('displays full build details in UTC if build time is set', async () => {
    window.BUILD_TIME = '1657373230123';
    render(<PlayerAppWrapper />);
    const { version } = packageInfo;
    const expectedDetails = new RegExp(`Version ${version} built at 2022-07-09, 13:27:10.123`);
    const details = await screen.findByText(expectedDetails);
    expect(details).toBeVisible();
  });
});
