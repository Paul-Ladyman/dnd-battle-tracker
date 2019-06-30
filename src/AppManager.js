import FileSaver from 'file-saver';

export function save(state) {
  const { ariaAnnouncements, ...stateToSave } = state;
  const blob = new Blob([JSON.stringify(stateToSave, null, 2)], {type : 'application/json'});
  const now = new Date(Date.now());
  const timeSuffix = `${now.toLocaleDateString()}_${now.toLocaleTimeString()}`;
  FileSaver.saveAs(blob, `dnd_battle_tracker_${timeSuffix}.json`);
}