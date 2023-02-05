const BASE_API_URL = 'https://www.dnd5eapi.co';

export async function getMonsters() {
  try {
    const response = await fetch(`${BASE_API_URL}/api/monsters`, { 'Content-Type': 'application/json' })
    const json = await response.json();
    const { results } = json;
    return results || [];
  } catch {
    return [];
  }
}

export async function getMonster(monster) {
  const { url } = monster;
  if (!url) return {};

  try {
    const response = await fetch(`${BASE_API_URL}${url}`, { 'Content-Type': 'application/json' });
    return await response.json();
  } catch {
    return {};
  }

  // const { url, name } = monster;
  // if (!url) return;
  // fetch(`${BASE_API_URL}${monster.url}`, { 'Content-Type': 'application/json' })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     const { hit_points: healthPoints, dexterity } = data;
  //     const dexterityModifier = calculateAbilityModifier(dexterity);
  //     const rolledNumber = rollDice(20);
  //     const initiative = `${rolledNumber + dexterityModifier}`;
  //     setState((prevState) => ({
  //       ...prevState,
  //       name,
  //       healthPoints: healthPoints || '',
  //       initiative,
  //       dexterityModifier,
  //     }));
  //   })
  //   .catch(() => {
  //     setState((prevState) => ({
  //       ...prevState,
  //       name: monster.name,
  //     }));
  //   });
}