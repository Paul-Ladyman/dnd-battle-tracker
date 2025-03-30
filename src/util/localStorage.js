const key = 'battle';

export function getLocalState() {
  return window.localStorage.getItem(key);
}

export function setLocalState(value) {
  return window.localStorage.setItem(key, value);
}

export function removeLocalState() {
  return window.localStorage.removeItem(key);
}
