import { validate } from 'jsonschema';
import FileSystem from './FileSystem';

const appSchema = require('./app-schema.json');

export function save(state) {
  const { ariaAnnouncements, errors, ...stateToSave } = state;
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
    ariaAnnouncements: newAriaAnnouncements
  };
}

export async function load(file, state) {
  const fileContents = await FileSystem.load(file);
  const loadedState = JSON.parse(fileContents);

  const { valid } = validate(loadedState, appSchema);

  const newState = valid ? loadedState : state;
  const ariaAnnouncement = valid ? 'battle loaded' : 'failed to load battle';
  const error = valid ? [] : [`Failed to load battle. The file ${file.name} was invalid.`];
  const ariaAnnouncements = state.ariaAnnouncements.concat([ariaAnnouncement]);
  const errors = valid ? error : state.errors.concat(error);

  return {
    ...newState,
    ariaAnnouncements,
    errors
  };
}

export function isSaveLoadSupported() {
  return FileSystem.isSaveSupported();
}

export function dismissErrors(state) {
  return {
    ...state,
    errors: []
  };
}
