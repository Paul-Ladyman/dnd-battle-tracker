import { getDamageLevel, getHealthBar } from './displayLogic';

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

describe('getHealthBar', () => {
  it('sets both health bar indicators fully right if a creature has full hit points', () => {
    const style = getHealthBar(100, 100, true);
    expect(style).toEqual([100, 100]);
  });

  it('sets both indicators fully right if a creature has greater than maximum hit points', () => {
    const style = getHealthBar(10, 9, true);
    expect(style).toEqual([100, 100]);
  });

  it('sets both indicators fully right if a creature has undefined hit points', () => {
    const style = getHealthBar(undefined, 100, true);
    expect(style).toEqual([100, 100]);
  });

  it('sets both indicators fully right if a creature has null hit points', () => {
    const style = getHealthBar(null, 100, true);
    expect(style).toEqual([100, 100]);
  });

  it('moves the left indicator to the left if a creature has less than full hit points', () => {
    const style = getHealthBar(99, 100, true);
    expect(style).toEqual([99, 100]);
  });

  it('moves the left indicator without moving the right up to 85% full hit points', () => {
    const style = getHealthBar(85, 100, true);
    expect(style).toEqual([85, 100]);
  });

  it('begins to move the right indicator below 85% full hit points', () => {
    const style = getHealthBar(84, 100, true);
    expect(style).toEqual([84, 99]);
  });

  it('keeps the indicators 15% apart below 85% full hit points', () => {
    const style = getHealthBar(10, 100, true);
    expect(style).toEqual([10, 25]);
  });

  it('calculates indicator percentages as integers given hp and maxHp', () => {
    const style = getHealthBar(10, 30, true);
    expect(style).toEqual([34, 49]);
  });

  it('sets both indicators fully left if a creature is not alive', () => {
    const style = getHealthBar(null, null, false);
    expect(style).toEqual([0, 0]);
  });

  it('sets both indicators fully left if a creature has 0 hit points', () => {
    const style = getHealthBar(0, 100, true);
    expect(style).toEqual([0, 0]);
  });

  it('sets both indicators fully left if a creature has negative hit points', () => {
    const style = getHealthBar(-1, 100, true);
    expect(style).toEqual([0, 0]);
  });

  it('sets both indicators fully left if a creature has 0 maximum hit points', () => {
    const style = getHealthBar(1, 0, true);
    expect(style).toEqual([0, 0]);
  });

  it('sets both indicators fully left if a creature has negative maximum hit points', () => {
    const style = getHealthBar(1, -1, true);
    expect(style).toEqual([0, 0]);
  });
});
