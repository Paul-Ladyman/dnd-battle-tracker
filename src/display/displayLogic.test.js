import getDamageLevel from './displayLogic';

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

  it('returns injured if the creature has 1 health left', () => {
    const damageLevel = getDamageLevel(1, 8);
    const expectedDamageLevel = { level: 'injured', display: 'Injured' };
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
    const expectedDamageLevel = { level: 'injured', display: 'Injured' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns injured if the creature has negative health', () => {
    const damageLevel = getDamageLevel(-1, 8);
    const expectedDamageLevel = { level: 'injured', display: 'Injured' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });
});
