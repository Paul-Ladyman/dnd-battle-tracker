import { getDamageLevel, getHitPointsBar, shouldShowHitPoints } from './displayLogic';

describe('getDamageLevel', () => {
  it('returns fine if the creature is at full health', () => {
    const damageLevel = getDamageLevel(8, 8);
    const expectedDamageLevel = { level: 'fine', display: 'Fine' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns fine if the creature has 1 HP and is at full health', () => {
    const damageLevel = getDamageLevel(1, 1);
    const expectedDamageLevel = { level: 'fine', display: 'Fine' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('handles floating point health values', () => {
    const damageLevel = getDamageLevel(8.1, 8.1);
    const expectedDamageLevel = { level: 'fine', display: 'Fine' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns damaged if the creature is below full health', () => {
    const damageLevel = getDamageLevel(7, 8);
    const expectedDamageLevel = { level: 'damaged', display: 'Damaged' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns damaged if the creature is at half health', () => {
    const damageLevel = getDamageLevel(4, 8);
    const expectedDamageLevel = { level: 'damaged', display: 'Damaged' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns injured if the creature is below half health', () => {
    const damageLevel = getDamageLevel(3, 8);
    const expectedDamageLevel = { level: 'injured', display: 'Injured' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns injured if the creature is at quarter health', () => {
    const damageLevel = getDamageLevel(2, 8);
    const expectedDamageLevel = { level: 'injured', display: 'Injured' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns injured and displays badly injured if the creature is below quarter health', () => {
    const damageLevel = getDamageLevel(1, 8);
    const expectedDamageLevel = { level: 'injured', display: 'Badly injured' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns injured and displays 0 if the creature is on 0 health', () => {
    const damageLevel = getDamageLevel(0, 8);
    const expectedDamageLevel = { level: 'injured', display: '0' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns injured and displays 0 if the creature has 0 max health', () => {
    const damageLevel = getDamageLevel(0, 0);
    const expectedDamageLevel = { level: 'injured', display: '0' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns if the creature has negative max health', () => {
    const damageLevel = getDamageLevel(-1, -1);
    const expectedDamageLevel = { level: 'injured', display: 'Badly injured' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns injured and displays Badly injured if the creature has negative health', () => {
    const damageLevel = getDamageLevel(-1, 8);
    const expectedDamageLevel = { level: 'injured', display: 'Badly injured' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });
});

describe('getHitPointsBar', () => {
  it('sets both health bar indicators fully right if a creature has full hit points', () => {
    const style = getHitPointsBar(100, 100, true, true);
    expect(style).toEqual([100, 100]);
  });

  it('sets both indicators fully right if a creature has greater than maximum hit points', () => {
    const style = getHitPointsBar(10, 9, true, true);
    expect(style).toEqual([100, 100]);
  });

  it('sets both indicators fully right if the creature\'s hit points are not to be shared', () => {
    const style = getHitPointsBar(50, 100, true, false);
    expect(style).toEqual([100, 100]);
  });

  it('sets both indicators fully right if a creature has undefined hit points', () => {
    const style = getHitPointsBar(undefined, 100, true, true);
    expect(style).toEqual([100, 100]);
  });

  it('sets both indicators fully right if a creature has null hit points', () => {
    const style = getHitPointsBar(null, 100, true, true);
    expect(style).toEqual([100, 100]);
  });

  it('moves the left indicator to the left if a creature has less than full hit points', () => {
    const style = getHitPointsBar(99, 100, true, true);
    expect(style).toEqual([99, 100]);
  });

  it('moves the left indicator without moving the right up to 85% full hit points', () => {
    const style = getHitPointsBar(85, 100, true, true);
    expect(style).toEqual([85, 100]);
  });

  it('begins to move the right indicator below 85% full hit points', () => {
    const style = getHitPointsBar(84, 100, true, true);
    expect(style).toEqual([84, 99]);
  });

  it('keeps the indicators 15% apart below 85% full hit points', () => {
    const style = getHitPointsBar(10, 100, true, true);
    expect(style).toEqual([10, 25]);
  });

  it('calculates indicator percentages as integers given hp and maxHp', () => {
    const style = getHitPointsBar(10, 30, true, true);
    expect(style).toEqual([34, 49]);
  });

  it('sets both indicators fully left if a creature is not alive', () => {
    const style = getHitPointsBar(null, null, false, true);
    expect(style).toEqual([0, 0]);
  });

  it('sets both indicators fully left if a creature has 0 hit points', () => {
    const style = getHitPointsBar(0, 100, true, true);
    expect(style).toEqual([0, 0]);
  });

  it('sets both indicators fully left if a creature has 0 hit points even if hit points aren\'t shared', () => {
    const style = getHitPointsBar(0, 100, true, false);
    expect(style).toEqual([0, 0]);
  });

  it('sets both indicators fully left if a creature has negative hit points', () => {
    const style = getHitPointsBar(-1, 100, true, true);
    expect(style).toEqual([0, 0]);
  });

  it('sets both indicators fully left if a creature has 0 maximum hit points', () => {
    const style = getHitPointsBar(1, 0, true, true);
    expect(style).toEqual([0, 0]);
  });

  it('sets both indicators fully left if a creature has negative maximum hit points', () => {
    const style = getHitPointsBar(1, -1, true, true);
    expect(style).toEqual([0, 0]);
  });
});

describe('shouldShowHitPoints', () => {
  it('returns true if hit points are defined and shared in a player session', () => {
    expect(shouldShowHitPoints(10, true, true)).toBe(true);
  });

  it('returns true if hit points are defined and not shared in a DM session', () => {
    expect(shouldShowHitPoints(10, false, false)).toBe(true);
  });

  it('returns true if hit points are defined and shared in a DM session', () => {
    expect(shouldShowHitPoints(10, true, false)).toBe(true);
  });

  it('returns false if hit points are defined but not shared in a player session', () => {
    expect(shouldShowHitPoints(10, false, true)).toBe(false);
  });

  it('returns false if hit points are null', () => {
    expect(shouldShowHitPoints(null, true, true)).toBe(false);
  });

  it('returns false if hit points are undefined', () => {
    expect(shouldShowHitPoints(undefined, true, true)).toBe(false);
  });
});
