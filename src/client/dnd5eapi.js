const BASE_API_URL = 'https://www.dnd5eapi.co';

export async function getMonsters() {
  try {
    const response = await fetch(`${BASE_API_URL}/api/monsters`, { 'Content-Type': 'application/json' });
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
}

export async function getSpells() {
  try {
    const response = await fetch(`${BASE_API_URL}/api/spells`, { 'Content-Type': 'application/json' });
    const json = await response.json();
    const { results } = json;
    return results || [];
  } catch {
    return [];
  }
}
