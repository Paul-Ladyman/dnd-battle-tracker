import { useEffect } from 'react';
import FileSystem from '../util/fileSystem';
import { getLocalState, setLocalState } from '../util/localStorage';
import { addError } from './ErrorManager';
import now from '../util/date';

function versionCompatibility(version, loadedVersion) {
  const majorVersion = version.split('.')[0];
  const loadedMajorVersion = loadedVersion && loadedVersion.split('.')[0];
  return majorVersion === loadedMajorVersion;
}

function battleSavedMoreThan12HoursAgo(timestamp) {
  const twelveHours = 12 * 60 * 60 * 1000;
  return Math.abs(now() - timestamp) >= twelveHours;
}

function getLoadStateJson(getState) {
  try {
    const storedBattle = getState();
    return JSON.parse(storedBattle);
  } catch {
    return false;
  }
}

function loadState(defaultState, getState, auto) {
  const errorMessage = auto ? 'Cannot autoload battle' : 'Failed to load battle';
  const loadedState = getLoadStateJson(getState);
  if (!loadedState) {
    const errors = loadedState === false ? addError(defaultState, `${errorMessage}. An unexpected error occured.`) : [];
    return {
      ...defaultState,
      ariaAnnouncements: ['failed to load battle'],
      errors,
    };
  }

  const { battleTrackerVersion } = defaultState;
  const { battleTrackerVersion: loadedBattleTrackerVersion, sharedTimestamp } = loadedState;

  const versionsAreCompatible = versionCompatibility(
    battleTrackerVersion,
    loadedBattleTrackerVersion,
  );

  if (!versionsAreCompatible) {
    const loadedVersion = loadedBattleTrackerVersion
      ? `version ${loadedBattleTrackerVersion}`
      : 'a different version';
    const error = `${errorMessage}. The saved battle was from ${loadedVersion} of the battle tracker and is not compatible with the current version, ${battleTrackerVersion}.`;
    const errors = addError(defaultState, error);
    return {
      ...defaultState,
      ariaAnnouncements: ['failed to load battle'],
      errors,
    };
  }

  const loadedBattle = {
    ...loadedState,
    errors: [],
    ariaAnnouncements: ['battle loaded'],
    createCreatureErrors: {},
    loaded: true,
  };

  if (battleSavedMoreThan12HoursAgo(sharedTimestamp)) {
    return {
      ...loadedBattle,
      battleCreated: defaultState.battleCreated,
      battleId: defaultState.battleId,
      shareEnabled: defaultState.shareEnabled,
      sharedTimestamp: defaultState.sharedTimestamp,
    };
  }

  return loadedBattle;
}

export async function load(state, file) {
  const stateFromFile = await FileSystem.load(file);
  return loadState(state, () => stateFromFile, false);
}

export function autoLoad(defaultState) {
  return loadState(defaultState, getLocalState, true);
}

export function save(state) {
  const {
    ariaAnnouncements, errors, createCreatureErrors, ...stateToSave
  } = state;
  const date = new Date(now());
  const dateSuffix = `${date.getDate()}_${date.getMonth()}_${date.getFullYear()}`;
  const timeSuffix = `${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
  const fileSuffix = `${dateSuffix}_${timeSuffix}`;
  const fileContents = JSON.stringify(stateToSave, null, 2);
  FileSystem.save(`dnd_battle_tracker_${fileSuffix}.json`, 'application/json', fileContents);

  const ariaAnnouncement = 'battle saved';
  const newAriaAnnouncements = state.ariaAnnouncements.concat([ariaAnnouncement]);
  return {
    ...state,
    ariaAnnouncements: newAriaAnnouncements,
  };
}

export function useAutoSave({
  state,
  setState,
}) {
  useEffect(() => {
    const { autoSaveError } = state;
    if (!autoSaveError) {
      try {
        setLocalState(JSON.stringify(state));
      } catch (e) {
        const errors = addError(state, 'An error occurred while autosaving the battle. Autosaving will be disabled until the page is reloaded.');
        setState({ ...state, errors, autoSaveError: true });
        window.onbeforeunload = () => true;
      }
    }
  }, [state]);
}

export function isSaveLoadSupported() {
  return FileSystem.isSaveSupported();
}
