import Creature from './creature';
import defaultState from '../../test/fixtures/battle';
import conditionsData from './conditions';

describe('toggleSelect', () => {
  it('selects a creature that is unselected', () => {
    const creature = new Creature(defaultState.creatures[0]);
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
    expect(newCreature.healthPoints).toBeNull();
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
    expect(newCreature.healthPoints).toBeNull();
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

describe('lock', () => {
  it('locks a creature that is unlocked', () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.lock();
    expect(newCreature.locked).toBe(true);
  });

  it('does nothing to a creature that is already locked', () => {
    const creature = new Creature(defaultState.creatures[1]);
    const newCreature = creature.lock();
    expect(newCreature.locked).toBe(true);
  });
});

describe('unlock', () => {
  it('unlocks a creature that is locked', () => {
    const creature = new Creature(defaultState.creatures[1]);
    const newCreature = creature.unlock();
    expect(newCreature.locked).toBe(false);
  });

  it('does nothing to a creature that is already unlocked', () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.unlock();
    expect(newCreature.locked).toBe(false);
  });
});

describe('share', () => {
  it('shares a creature that is unshared', () => {
    const creature = new Creature(defaultState.creatures[1]);
    const newCreature = creature.share();
    expect(newCreature.shared).toBe(true);
  });

  it('does nothing to a creature that is already shared', () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.share();
    expect(newCreature.shared).toBe(true);
  });
});

describe('unshare', () => {
  it('unshare a creature that is shared', () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.unshare();
    expect(newCreature.shared).toBe(false);
  });

  it('does nothing to a creature that is already unshared', () => {
    const creature = new Creature(defaultState.creatures[1]);
    const newCreature = creature.unshare();
    expect(newCreature.shared).toBe(false);
  });
});

describe('shareHitPoints', () => {
  it("shares a creature's HP when it is unshared", () => {
    const creature = new Creature(defaultState.creatures[1]);
    const newCreature = creature.shareHitPoints();
    expect(newCreature.hitPointsShared).toBe(true);
  });

  it("does nothing to a creature who's HP is already shared", () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.shareHitPoints();
    expect(newCreature.hitPointsShared).toBe(true);
  });
});

describe('unshareHitPoints', () => {
  it("unshares a creature's HP when it is shared", () => {
    const creature = new Creature(defaultState.creatures[0]);
    const newCreature = creature.unshareHitPoints();
    expect(newCreature.hitPointsShared).toBe(false);
  });

  it("does nothing to a creature's HP when it is already unshared", () => {
    const creature = new Creature(defaultState.creatures[1]);
    const newCreature = creature.unshareHitPoints();
    expect(newCreature.hitPointsShared).toBe(false);
  });
});
