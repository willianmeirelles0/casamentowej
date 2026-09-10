const STORAGE_KEY = "jw-casamento-presentes-dados";

const EMPTY: string[] = [];
const listeners = new Set<() => void>();

let cache: string[] | null = null;

function readFromStorage(): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

export function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getSnapshot(): string[] {
  if (cache === null) cache = readFromStorage();
  return cache;
}

export function getServerSnapshot(): string[] {
  return EMPTY;
}

export function markGiftGiven(giftId: string) {
  const current = getSnapshot();
  if (current.includes(giftId)) return;

  cache = [...current, giftId];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage indisponível (modo privado, etc.); a marcação vale só para esta sessão.
  }
  listeners.forEach((callback) => callback());
}
