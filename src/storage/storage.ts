import { get, set } from "idb-keyval";

export async function storageGet<T>(key: string): Promise<T | null> {
  try {
    const val = await get<string>(key);
    if (!val) return null;
    return JSON.parse(val) as T;
  } catch {
    return null;
  }
}

export async function storageSet(key: string, value: unknown): Promise<boolean> {
  try {
    await set(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
