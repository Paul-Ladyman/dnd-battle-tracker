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

  it('returns critical if the creature is at quarter health', () => {
    const damageLevel = getDamageLevel(2, 8);
    const expectedDamageLevel = { level: 'critical', display: 'Critical' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns critical if the creature is below quarter health', () => {
    const damageLevel = getDamageLevel(1, 8);
    const expectedDamageLevel = { level: 'critical', display: 'Critical' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns critical and displays 0 if the creature is on 0 health', () => {
    const damageLevel = getDamageLevel(0, 8);
    const expectedDamageLevel = { level: 'critical', display: '0' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns critical and displays 0 if the creature has 0 max health', () => {
    const damageLevel = getDamageLevel(0, 0);
    const expectedDamageLevel = { level: 'critical', display: '0' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns if the creature has negative max health', () => {
    const damageLevel = getDamageLevel(-1, -1);
    const expectedDamageLevel = { level: 'critical', display: 'Critical' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });

  it('returns critical if the creature has negative health', () => {
    const damageLevel = getDamageLevel(-1, 8);
    const expectedDamageLevel = { level: 'critical', display: 'Critical' };
    expect(damageLevel).toEqual(expectedDamageLevel);
  });
});
