const DEFAULT_API_URL = "http://localhost:3000";

export function getApiBaseUrl() {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  return stripTrailingSlash(configuredUrl || DEFAULT_API_URL);
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

