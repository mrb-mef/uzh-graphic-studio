const SESSION_KEY = 'uzh_studio_anthropic_key';

export function getAnthropicKey(): string {
  return sessionStorage.getItem(SESSION_KEY) ?? '';
}

export function setAnthropicKey(key: string): void {
  if (key) {
    sessionStorage.setItem(SESSION_KEY, key);
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

export function hasAnthropicKey(): boolean {
  return Boolean(sessionStorage.getItem(SESSION_KEY));
}
