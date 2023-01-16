import React from 'react';
import { render, screen, findByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DungeonMasterAppWrapper from '../src/components/app/DungeonMasterAppWrapper';
import 'cross-fetch/polyfill';

async function addCreature(user) {
  const name = await screen.findByText('Creature Name');
  await user.type(name, 'goblin');
  const add = await screen.findByRole('button', { name: 'Add creature' });
  await user.click(add);
}

function findToolbar() {
  return screen.findByRole('toolbar', { name: 'goblin toolbar' });
}

function findToolbarButton(toolbar, name) {
  return findByRole(toolbar, 'button', { name });
}

describe('Creature toolbar', () => {
  beforeAll(() => {
    window.FLAG_creatureToolbar = true;
  });

  test('a creature has a toolbar', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await addCreature(user);
    const toolbar = await findToolbar();
    expect(toolbar).toBeVisible();
  });

  it('contains the creature menu button', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await addCreature(user);
    const toolbar = await findToolbar();
    const button = await findToolbarButton(toolbar, 'Creature Menu');
    expect(button).toBeVisible();
  });

  it('contains the kill creature button', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await addCreature(user);
    const toolbar = await findToolbar();
    const button = await findToolbarButton(toolbar, 'Kill/Make unconscious');
    expect(button).toBeVisible();
  });

  it('contains the initiative button', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await addCreature(user);
    const toolbar = await findToolbar();
    const button = await findToolbarButton(toolbar, 'Initiative');
    expect(button).toBeVisible();
  });

  it('contains the conditions button', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await addCreature(user);
    const toolbar = await findToolbar();
    const button = await findToolbarButton(toolbar, 'Conditions');
    expect(button).toBeVisible();
  });

  it('contains the notes button', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await addCreature(user);
    const toolbar = await findToolbar();
    const button = await findToolbarButton(toolbar, 'Notes');
    expect(button).toBeVisible();
  });

  it('contains the HP button', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await addCreature(user);
    const toolbar = await findToolbar();
    const button = await findToolbarButton(toolbar, 'HP');
    expect(button).toBeVisible();
  });

  it('contains the max hp button', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await addCreature(user);
    const toolbar = await findToolbar();
    const button = await findToolbarButton(toolbar, 'Max HP');
    expect(button).toBeVisible();
  });

  it('contains the temp hp button', async () => {
    render(<DungeonMasterAppWrapper />);
    const user = userEvent.setup();
    await addCreature(user);
    const toolbar = await findToolbar();
    const button = await findToolbarButton(toolbar, 'Temp HP');
    expect(button).toBeVisible();
  });
});
