export const STORAGE_KEY = 'snake_muted'

export function isMuted() {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

export function setMuted(value) {
  localStorage.setItem(STORAGE_KEY, value)
}
