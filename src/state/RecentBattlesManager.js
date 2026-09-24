import packageJson from '../../package.json';
import now from '../util/date';

const historyKey = 'battle-history';
export const recentBattleLimit = 3;

function versionCompatibility(version, loadedVersion) {
  if (typeof version !== 'string' || typeof loadedVersion !== 'string') return false;
  const majorVersion = version.split('.')[0];
  const loadedMajorVersion = loadedVersion.split('.')[0];
  return majorVersion === loadedMajorVersion;
}

function readHistory() {
  try {
    const history = JSON.parse(window.localStorage.getItem(historyKey));
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

function validSnapshot(snapshot) {
  return Number.isFinite(snapshot?.savedAt)
    && snapshot?.state
    && typeof snapshot.state === 'object'
    && versionCompatibility(packageJson.version, snapshot.state.battleTrackerVersion);
}

function stateForHistory(state) {
  const {
    ariaAnnouncements,
    errors,
    autoSaveError,
    loaded,
    battleId,
    battleCreated,
    shareEnabled,
    sharedTimestamp,
    ...stateToArchive
  } = state;
  return stateToArchive;
}

function battleHasContent(state) {
  return Array.isArray(state.creatures) && state.creatures.length > 0;
}

export function getRecentBattles() {
  return readHistory()
    .filter(validSnapshot)
    .slice(0, recentBattleLimit);
}

export function archiveRecentBattle(state) {
  if (!battleHasContent(state)) return false;

  const stateToArchive = stateForHistory(state);
  const history = getRecentBattles();
  const sameAsLatest = history[0]
    && JSON.stringify(history[0].state) === JSON.stringify(stateToArchive);

  if (sameAsLatest) return false;

  const newHistory = [
    {
      savedAt: now(),
      state: stateToArchive,
    },
    ...history,
  ].slice(0, recentBattleLimit);

  try {
    window.localStorage.setItem(historyKey, JSON.stringify(newHistory));
    return true;
  } catch {
    return false;
  }
}

export function restoreRecentBattle(currentState, snapshot) {
  if (!validSnapshot(snapshot)) return currentState;

  archiveRecentBattle(currentState);

  const {
    battleId,
    battleCreated,
    shareEnabled,
    sharedTimestamp,
    autoSaveError,
    loaded,
  } = currentState;

  return {
    ...snapshot.state,
    battleId,
    battleCreated,
    shareEnabled,
    sharedTimestamp,
    autoSaveError,
    loaded,
    errors: [],
    ariaAnnouncements: ['recent battle restored'],
  };
}
