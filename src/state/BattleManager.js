import { resetCreature } from './CreatureManager';
import packageJson from '../../package.json';

export const newBattleState = {
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
  rulesSearchOpened: false,
};

export function resetBattle(state) {
  const {
    creatures,
    ariaAnnouncements: currentAriaAnnouncements,
    battleId,
    shareEnabled,
    battleCreated,
  } = state;
  const lockedCreatures = creatures.filter((creature) => creature.locked);
  const creatureIdCount = lockedCreatures.length;
  const resetLockedCreatures = lockedCreatures.map((creature, id) => resetCreature(id, creature));
  const ariaAnnouncements = currentAriaAnnouncements.concat(['battle reset']);
  return {
    ...newBattleState,
    battleCreated,
    shareEnabled,
    battleId,
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

export function toggleRulesSearch(state) {
  const { rulesSearchOpened, ariaAnnouncements: currentAriaAnnouncements } = state;
  const announcement = rulesSearchOpened ? 'rules search closed' : 'rules search opened';
  const ariaAnnouncements = currentAriaAnnouncements.concat([announcement]);
  return { ...state, rulesSearchOpened: !rulesSearchOpened, ariaAnnouncements };
}
