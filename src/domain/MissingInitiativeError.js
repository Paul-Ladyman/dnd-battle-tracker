export default class MissingInitiativeError extends Error {
  constructor(creature) {
    super();
    this.creature = creature;
  }
}
