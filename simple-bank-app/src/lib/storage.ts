import * as SecureStore from "expo-secure-store";

export async function getSecureItem(key: string) {
  return SecureStore.getItemAsync(key);
}

export async function setSecureItem(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function deleteSecureItem(key: string) {
  await SecureStore.deleteItemAsync(key);
}

export async function getSecureJson<T>(key: string): Promise<T | null> {
  const raw = await getSecureItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    await deleteSecureItem(key);
    return null;
  }
}

export function setSecureJson<T>(key: string, value: T) {
  return setSecureItem(key, JSON.stringify(value));
}

