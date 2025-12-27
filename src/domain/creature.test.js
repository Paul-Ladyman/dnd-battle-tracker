import Creature from './creature';
import defaultState from '../../test/fixtures/battle';
import conditionsData from './conditions';

describe('toggleSelect', () => {
  it('selects a creature that is unselected', () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.toggleSelect();
    expect(newCreature.selected).toBe(true);
  });

  it('selects a creature that does not have a selected field', () => {
    const state = {
      ...defaultState.creatures[0],
      selected: undefined,
    };
    const creature = new Creature(state);
    const newCreature = creature.toggleSelect();
    expect(newCreature.selected).toBe(true);
  });

  it('unselects a creature that is selected', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          selected: true,
        },
        defaultState.creatures[2],
      ],
    };
    const creature = new Creature(state.creatures[1]);
    const newCreature = creature.toggleSelect();
    expect(newCreature.selected).toBe(false);
  });
});

describe('unselect', () => {
  it('does nothing to a creature that is unselected', () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.unselect();
    expect(newCreature.selected).toBe(false);
  });

  it('unselects a creature that does not have a selected field', () => {
    const state = {
      ...defaultState.creatures[0],
      selected: undefined,
    };
    const creature = new Creature(state);
    const newCreature = creature.unselect();
    expect(newCreature.selected).toBe(false);
  });

  it('unselects a creature that is selected', () => {
    const state = {
      ...defaultState,
      creatures: [
        defaultState.creatures[0],
        {
          ...defaultState.creatures[1],
          selected: true,
        },
        defaultState.creatures[2],
      ],
    };
    const creature = new Creature(state.creatures[1]);
    const newCreature = creature.unselect();
    expect(newCreature.selected).toBe(false);
  });
});

describe('kill', () => {
  it('sets alive to false', () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.kill(0);
    expect(newCreature.alive).toBe(false);
  });

  it('adds the unconscious condition', () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.kill(2);
    const unconsciousCondition = {
      text: conditionsData.Unconscious.text,
      appliedAtRound: 2,
      appliedAtSeconds: 6,
      url: conditionsData.Unconscious.url,
      id: conditionsData.Unconscious.id,
    };
    expect(newCreature.conditions).toEqual([unconsciousCondition]);
  });

  it('does not add the unconscious condition if called multiple times', () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.kill(2).kill(2);
    const unconsciousCondition = {
      text: conditionsData.Unconscious.text,
      appliedAtRound: 2,
      appliedAtSeconds: 6,
      url: conditionsData.Unconscious.url,
      id: conditionsData.Unconscious.id,
    };
    expect(newCreature.conditions).toEqual([unconsciousCondition]);
  });

  it('does not modify health points if the creature has none', () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.kill(0);
    expect(newCreature.healthPoints).toBeUndefined();
  });

  it('sets health points to 0 if the creature has them', () => {
    const creature = new Creature(defaultState.creatures[1]);
    const newCreature = creature.kill(0);
    expect(newCreature.healthPoints).toBe(0);
  });
});

describe('stabilize', () => {
  it('stabilizes a creature who is dead with 0 hit points', () => {
    const creatureState = {
      ...defaultState.creatures[1],
      alive: false,
      healthPoints: 0,
    };

    const creature = new Creature(creatureState);

    const newCreature = creature.stabilize();
    expect(newCreature.alive).toBe(true);
    expect(newCreature.healthPoints).toBe(0);
  });

  it('stabilizes a creature who is dead with no hit points', () => {
    const creatureState = {
      ...defaultState.creatures[0],
      alive: false,
    };

    const creature = new Creature(creatureState);

    const newCreature = creature.stabilize();
    expect(newCreature.alive).toBe(true);
    expect(newCreature.healthPoints).toBeUndefined();
  });

  it('stabilizes a creature who is already alive', () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.stabilize();
    expect(newCreature.alive).toBe(true);
  });
});

describe('serialize', () => {
  it('returns the creature as JSON', () => {
    const creature = new Creature(defaultState.creatures[0]);
    expect(creature.serialize()).toEqual(defaultState.creatures[0]);
  });
});
