import MissingInitiativeError from './MissingInitiativeError';

export default class Encounter {
  constructor(creatures = [], round = 0, turn = null, turns = []) {
    this.round = round;
    this.turns = turns;
    this.turn = turn;
    this.creatures = creatures;
  }

  nextTurn() {
    if (this.creatures.count() === 0) return this;

    const creatureWithoutInitiative = this.creatures.findFirst(
      ({ initiative }) => !Number.isInteger(initiative),
    );

    if (creatureWithoutInitiative) throw new MissingInitiativeError(creatureWithoutInitiative);

    const initiativeOrder = this.creatures.getInitiativeOrder();
    const currentCreatureIndex = initiativeOrder.getIndex(this.turn) || -1;
    const nextCreature = initiativeOrder.findFirst(
      ({ id }, i) => !this.turns.includes(id) && i > currentCreatureIndex,
    );
    if (nextCreature) {
      const { id } = nextCreature;
      const turns = [
        ...this.turns,
        id,
      ];
      const round = this.round === 0 ? 1 : this.round;
      return new Encounter(initiativeOrder, round, id, turns);
    }

    const turn = initiativeOrder.getFirst().id;
    return new Encounter(initiativeOrder, this.round + 1, turn, [turn]);
  }
}
