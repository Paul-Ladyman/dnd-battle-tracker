import FileSystem from './FileSystem';

export function save(state) {
  const { ariaAnnouncements, ...stateToSave } = state;
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
  const ariaAnnouncement = 'battle loaded';
  const newAriaAnnouncements = state.ariaAnnouncements.concat([ariaAnnouncement]);
  return {
    ...JSON.parse(fileContents),
    ariaAnnouncements: newAriaAnnouncements
  };
}
