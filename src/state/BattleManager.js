import { resetCreature } from './CreatureManager';
import packageJson from '../../package.json';

export function newBattleState() {
  return {
    creatures: [],
    creatureIdCount: 0,
    activeCreature: null,
    focusedCreature: undefined,
    round: 0,
    ariaAnnouncements: [],
    errors: [],
    createCreatureErrors: {},
    battleId: undefined,
    battleCreated: false,
    shareEnabled: false,
    battleTrackerVersion: packageJson.version,
    sharedTimestamp: null,
  };
}

export function resetBattle(state) {
  const {
    creatures,
    ariaAnnouncements: currentAriaAnnouncements,
    battleId,
    shareEnabled,
    battleCreated,
    sharedTimestamp,
  } = state;
  const lockedCreatures = creatures.filter((creature) => creature.locked);
  const creatureIdCount = lockedCreatures.length;
  const resetLockedCreatures = lockedCreatures.map((creature, id) => resetCreature(id, creature));
  const ariaAnnouncements = currentAriaAnnouncements.concat(['battle reset']);
  return {
    ...newBattleState(),
    battleCreated,
    shareEnabled,
    battleId,
    sharedTimestamp,
    creatureIdCount,
    creatures: resetLockedCreatures,
    ariaAnnouncements,
  };
}

export function toggleSync(state) {
  const { shareEnabled, ariaAnnouncements: currentAriaAnnouncements } = state;
  const announcement = shareEnabled ? 'share disabled' : 'share enabled';
  const ariaAnnouncements = currentAriaAnnouncements.concat([announcement]);
  return { ...state, shareEnabled: !shareEnabled, ariaAnnouncements };
}
