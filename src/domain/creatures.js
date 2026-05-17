import Creature from './creature';

export default class Creatures {
  constructor(creatures, deserialize = true) {
    this.list = deserialize ? creatures.map((creature) => new Creature(creature)) : creatures;
  }

  getInitiativeOrder() {
    const initiativeOrder = this.list.sort((creatureA, creatureB) => {
      const initiativeA = creatureA.initiative;
      const initiativeB = creatureB.initiative;

      if (initiativeA === initiativeB) {
        const tieBreakerA = creatureA.initiativeTieBreaker || 0;
        const tieBreakerB = creatureB.initiativeTieBreaker || 0;
        return tieBreakerB - tieBreakerA;
      }

      return initiativeB - initiativeA;
    });

    return new Creatures(initiativeOrder, false);
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

  getFirst() {
    return this.list[0] || null;
  }

  findFirst(fn) {
    return this.list.find(fn) || null;
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

  count() {
    return this.list.length;
  }

  serialize() {
    return this.list.map((creature) => creature.serialize());
  }
}
