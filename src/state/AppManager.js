import { validate } from 'jsonschema';
import find from 'lodash.find';
import FileSystem from '../util/fileSystem';

const appSchema = require('../resources/app-schema.json');

export function save(state) {
  const {
    ariaAnnouncements, errors, createCreatureErrors, ...stateToSave
  } = state;
  const now = new Date(Date.now());
  const dateSuffix = `${now.getDate()}_${now.getMonth()}_${now.getFullYear()}`;
  const timeSuffix = `${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`;
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

function jsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

export async function load(state, file) {
  const fileContents = await FileSystem.load(file);
  const loadedState = jsonParse(fileContents);

  const { valid: validSchema } = validate(loadedState, appSchema);

  const validLoadedState = loadedState && validSchema;

  const { battleId, battleCreated, shareEnabled } = state;

  const newState = validLoadedState ? loadedState : state;
  const ariaAnnouncement = validLoadedState ? 'battle loaded' : 'failed to load battle';
  const error = validLoadedState ? [] : [`Failed to load battle. The file "${file.name}" was invalid.`];
  const ariaAnnouncements = state.ariaAnnouncements.concat([ariaAnnouncement]);
  const errors = validLoadedState ? error : addError(state, error);

  return {
    ...newState,
    battleId,
    battleCreated,
    shareEnabled,
    ariaAnnouncements,
    errors,
    createCreatureErrors: {},
  };
}

export function isSaveLoadSupported() {
  return FileSystem.isSaveSupported();
}

export function dismissErrors(state) {
  return {
    ...state,
    errors: [],
  };
}

export function addError(state, errorToAdd) {
  const errorExists = find(state.errors, (error) => error === errorToAdd);

  if (errorExists) {
    return state.errors;
  }

  return state.errors.concat(errorToAdd);
}

export function updateErrors(state, errorToAdd) {
  const errors = addError(state, errorToAdd);
  return { ...state, errors };
}
