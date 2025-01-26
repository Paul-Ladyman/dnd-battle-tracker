import {
  render,
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import TabList from './TabList';

const tabs = [
  {
    label: 'one',
    id: 'one',
  },
  {
    label: 'two',
    id: 'two',
  },
];
const panels = ['panel one', 'panel two'];

describe('TabList', () => {
  it('selects the first tab by default', () => {
    render(<TabList tabs={tabs} panels={panels} />);
    const tab = screen.getByRole('tab', { name: 'one' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  it('does not select the other tabs by default', () => {
    render(<TabList tabs={tabs} panels={panels} />);
    const tab = screen.getByRole('tab', { name: 'two' });
    expect(tab).toHaveAttribute('aria-selected', 'false');
  });

  it('shows the first panel by default', () => {
    render(<TabList tabs={tabs} panels={panels} />);
    const tabPanel = screen.getByRole('tabpanel', { name: 'one' });
    expect(tabPanel).toBeVisible();
  });

  it('shows the other panels by default', () => {
    render(<TabList tabs={tabs} panels={panels} />);
    const tabPanel = screen.queryByRole('tabpanel', { name: 'two' });
    expect(tabPanel).toBeNull();
  });

  it('selects another tab on click', async () => {
    const user = userEvent.setup();
    render(<TabList tabs={tabs} panels={panels} />);
    const tabOne = screen.getByRole('tab', { name: 'one' });
    const tabTwo = screen.getByRole('tab', { name: 'two' });
    await user.click(tabTwo);
    expect(tabOne).toHaveAttribute('aria-selected', 'false');
    expect(tabTwo).toHaveAttribute('aria-selected', 'true');
  });

  it('shows another panel when its tab is clicked', async () => {
    const user = userEvent.setup();
    render(<TabList tabs={tabs} panels={panels} />);
    const tabTwo = screen.getByRole('tab', { name: 'two' });
    await user.click(tabTwo);
    const panelOne = screen.queryByRole('tabpanel', { name: 'one' });
    const panelTwo = screen.queryByRole('tabpanel', { name: 'two' });
    expect(panelOne).toBeNull();
    expect(panelTwo).toBeVisible();
  });
});
