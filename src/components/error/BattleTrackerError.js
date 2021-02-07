export default class BattleTrackerError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = 'BattleTrackerError'; // (2)
  }
}
