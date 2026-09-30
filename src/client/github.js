export const LATEST_RELEASE_URL = 'https://github.com/Paul-Ladyman/dnd-battle-tracker/releases/latest';

const LATEST_RELEASE_API_URL = 'https://api.github.com/repos/Paul-Ladyman/dnd-battle-tracker/releases/latest';
const CACHE_KEY = 'dnd-battle-tracker-latest-release';
const CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000;

function parseVersion(version) {
  if (typeof version !== 'string') return null;

  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version);
  return match ? match.slice(1).map(Number) : null;
}

export function isNewerVersion(candidate, current) {
  const candidateParts = parseVersion(candidate);
  const currentParts = parseVersion(current);

  if (!candidateParts || !currentParts) return false;

  const changedPart = candidateParts.findIndex(
    (part, index) => part !== currentParts[index],
  );

  return changedPart !== -1 && candidateParts[changedPart] > currentParts[changedPart];
}

function getCachedLatestReleaseVersion() {
  try {
    const cachedRelease = JSON.parse(window.localStorage.getItem(CACHE_KEY));
    if (!cachedRelease) return null;

    const { version, checkedAt } = cachedRelease;
    const cacheAge = Math.abs(Date.now() - checkedAt);

    if (!parseVersion(version) || !Number.isFinite(checkedAt) || cacheAge >= CACHE_MAX_AGE_MS) {
      return null;
    }

    return version;
  } catch {
    return null;
  }
}

function cacheLatestReleaseVersion(version) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({
      version,
      checkedAt: Date.now(),
    }));
  } catch {
    // Update checks should never interfere with the battle tracker.
  }
}

export async function getLatestReleaseVersion() {
  const cachedVersion = getCachedLatestReleaseVersion();
  if (cachedVersion) return cachedVersion;

  try {
    const response = await fetch(LATEST_RELEASE_API_URL);
    if (!response.ok) return null;

    const release = await response.json();
    const version = release.tag_name && release.tag_name.replace(/^v/, '');

    if (!parseVersion(version)) return null;

    cacheLatestReleaseVersion(version);
    return version;
  } catch {
    return null;
  }
}
