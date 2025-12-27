import Creature from './creature';

export default class Creatures {
  constructor(creatures, deserialize = true) {
    this.list = deserialize ? creatures.map((creature) => new Creature(creature)) : creatures;
  }

  updateCreature(id, fn) {
    const newList = this.list.map((creature) => {
      if (creature.id === id) return fn(creature);
      return creature;
    });
    return new Creatures(newList, false);
  }

  updateCreatureAndSelected(id, fn) {
    const newList = this.list.map((creature) => {
      if (creature.id === id || (creature.selected)) return fn(creature);
      return creature;
    });
    return new Creatures(newList, false);
  }

  updateAll(fn) {
    const newList = this.list.map(fn);
    return new Creatures(newList, false);
  }

  getIndex(id) {
    const index = this.list.findIndex((creature) => creature.id === id);
    return index > -1 ? index : null;
  }

  get(id) {
    return this.list.find((creature) => creature.id === id) || null;
  }

  getAndSelected(id) {
    return this.list.filter((creature) => creature.id === id || creature.selected);
  }

  countSelected() {
    return this.list.filter((creature) => creature.selected).length;
  }

  serialize() {
    return this.list.map((creature) => creature.serialize());
  }
}
