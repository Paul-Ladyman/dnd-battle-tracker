import { monsterUrlFrom5eApiIndex } from './dndBeyond';

describe('monsterUrlFrom5eApiIndex', () => {
  it('returns the monster URL for a dnd5eapi index', () => {
    expect(monsterUrlFrom5eApiIndex('goblin')).toBe('https://www.dndbeyond.com/monsters/goblin');
  });

  test.each([
    ['giant-rat-diseased', 'https://www.dndbeyond.com/monsters/diseased-giant-rat'],
    ['succubus-incubus', 'https://www.dndbeyond.com/monsters/succubus'],
    ['swarm-of-beetles', 'https://www.dndbeyond.com/monsters/swarm-of-insects-beetles'],
    ['swarm-of-centipedes', 'https://www.dndbeyond.com/monsters/swarm-of-insects-centipedes'],
    ['swarm-of-spiders', 'https://www.dndbeyond.com/monsters/swarm-of-insects-spiders'],
    ['swarm-of-wasps', 'https://www.dndbeyond.com/monsters/swarm-of-insects-wasps'],
    ['vampire-bat', 'https://www.dndbeyond.com/monsters/vampire'],
    ['vampire-mist', 'https://www.dndbeyond.com/monsters/vampire'],
    ['vampire-vampire', 'https://www.dndbeyond.com/monsters/vampire'],
    ['werebear-bear', 'https://www.dndbeyond.com/monsters/werebear'],
    ['werebear-human', 'https://www.dndbeyond.com/monsters/werebear'],
    ['werebear-hybrid', 'https://www.dndbeyond.com/monsters/werebear'],
    ['wereboar-boar', 'https://www.dndbeyond.com/monsters/wereboar'],
    ['wereboar-human', 'https://www.dndbeyond.com/monsters/wereboar'],
    ['wereboar-hybrid', 'https://www.dndbeyond.com/monsters/wereboar'],
    ['wererat-human', 'https://www.dndbeyond.com/monsters/wererat'],
    ['wererat-hybrid', 'https://www.dndbeyond.com/monsters/wererat'],
    ['wererat-rat', 'https://www.dndbeyond.com/monsters/wererat'],
    ['weretiger-human', 'https://www.dndbeyond.com/monsters/weretiger'],
    ['weretiger-hybrid', 'https://www.dndbeyond.com/monsters/weretiger'],
    ['weretiger-tiger', 'https://www.dndbeyond.com/monsters/weretiger'],
    ['werewolf-human', 'https://www.dndbeyond.com/monsters/werewolf'],
    ['werewolf-hybrid', 'https://www.dndbeyond.com/monsters/werewolf'],
    ['werewolf-wolf', 'https://www.dndbeyond.com/monsters/werewolf'],
  ])('it returns the correct monster URL for %p', (index, url) => {
    expect(monsterUrlFrom5eApiIndex(index)).toBe(url);
  });

  it('returns null if the dnd5eapi index is empty', () => {
    expect(monsterUrlFrom5eApiIndex('')).toBeNull();
  });

  it('returns null if the dnd5eapi index is undefined', () => {
    expect(monsterUrlFrom5eApiIndex()).toBeNull();
  });

  it('returns null if the dnd5eapi index is null', () => {
    expect(monsterUrlFrom5eApiIndex(null)).toBeNull();
  });

  it('returns null if the dnd5eapi index is not a string', () => {
    expect(monsterUrlFrom5eApiIndex(1)).toBeNull();
  });
});
