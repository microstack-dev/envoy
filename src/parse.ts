export function parseString(value: string): string {
  return value;
}

export function parseNumber(value: string): number {
  const n = Number(value);
  if (Number.isNaN(n)) {
    throw new Error(`must be a number (received "${value}")`);
  }
  return n;
}

export function parseBoolean(value: string): boolean {
  const v = value.toLowerCase();
  if (v === 'true' || v === '1') return true;
  if (v === 'false' || v === '0') return false;
  throw new Error(`must be a boolean (received "${value}")`);
}

export function parseEnum<T extends string>(value: string, allowed: readonly T[]): T {
  if (!allowed.includes(value as T)) {
    throw new Error(`must be one of: ${allowed.join(", ")} (received "${value}")`);
  }
  return value as T;
}
