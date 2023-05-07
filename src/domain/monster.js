import { calculateAbilityModifier } from './characterSheet';
import { getMonster as getMonsterClient } from '../client/dnd5eapi';

function getArmorClassValue(armorClass) {
  const armorClassValid = Array.isArray(armorClass) && armorClass.length > 0;
  return armorClassValid ? armorClass[0].value : null;
}

class Monster {
  constructor(monster, data) {
    const {
      name,
      hit_points: hp,
      hit_points_roll: hpRoll,
      dexterity,
      armor_class: armorClass,
    } = data;

    this.stats = data;
    this.name = name || monster.name;
    this.hp = hp;
    this.hpRoll = hpRoll;
    this.dexterity = dexterity;
    this.dexterityModifier = calculateAbilityModifier(dexterity);
    this.armorClass = getArmorClassValue(armorClass);
  }
}

export default async function getMonster(monster) {
  const data = await getMonsterClient(monster);
  return new Monster(monster, data);
}
