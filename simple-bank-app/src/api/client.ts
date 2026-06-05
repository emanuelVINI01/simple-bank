import { ApiError, getApiErrorMessage } from "@/api/errors";
import { buildApiUrl } from "@/lib/config";
import { getCookieHeader, saveCookiesFromResponse } from "@/lib/cookies";

type RequestOptions = RequestInit & {
  authenticated?: boolean;
  fallbackMessage: string;
};

export async function requestJson<T>(path: string, options: RequestOptions) {
  const response = await rawRequest(path, options);
  const payload = await readResponsePayload(response);

  if (!response.ok) {
    throw new ApiError(getApiErrorMessage(payload, options.fallbackMessage), response.status, typeof payload === "object" && payload !== null ? payload : undefined);
  }

  return payload as T;
}

export async function requestEmpty(path: string, options: RequestOptions) {
  const response = await rawRequest(path, options);

  if (!response.ok) {
    const payload = await readResponsePayload(response);
    throw new ApiError(getApiErrorMessage(payload, options.fallbackMessage), response.status, typeof payload === "object" && payload !== null ? payload : undefined);
  }
}

export async function rawRequest(path: string, options: RequestOptions) {
  const headers = new Headers(options.headers);
  const cookieHeader = await getCookieHeader();

  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers,
    credentials: "include",
  });

  await saveCookiesFromResponse(response);
  return response;
}

async function readResponsePayload(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

