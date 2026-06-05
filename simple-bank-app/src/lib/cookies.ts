import { deleteSecureItem, getSecureJson, setSecureJson } from "@/lib/storage";

const COOKIE_JAR_KEY = "simple-bank.auth.cookie-jar";

type CookieRecord = Record<string, string>;

export async function getCookieHeader() {
  const jar = await readCookieJar();
  const entries = Object.entries(jar)
    .map(([name, value]) => [name, sanitizeCookieValue(value)] as const)
    .filter(([name, value]) => isValidCookieName(name) && value.length > 0);
  if (entries.length === 0) return null;

  return entries.map(([name, value]) => `${name}=${value}`).join("; ");
}

export async function saveCookiesFromResponse(response: Response) {
  const setCookieHeaders = getSetCookieHeaders(response.headers);
  if (setCookieHeaders.length === 0) return;

  const jar = await readCookieJar();
  let changed = false;

  setCookieHeaders.forEach((header) => {
    const cookie = parseCookie(header);
    if (!cookie) return;

    const value = sanitizeCookieValue(cookie.value);

    if (isExpiredCookie(header) || value === "") {
      delete jar[cookie.name];
    } else {
      jar[cookie.name] = value;
    }

    changed = true;
  });

  if (changed) {
    await setSecureJson(COOKIE_JAR_KEY, jar);
  }
}

export function clearCookieJar() {
  return deleteSecureItem(COOKIE_JAR_KEY);
}

export async function clearAuthHandshakeCookies() {
  const jar = await readCookieJar();
  let changed = false;

  Object.keys(jar).forEach((name) => {
    if (isAuthHandshakeCookie(name)) {
      delete jar[name];
      changed = true;
    }
  });

  if (changed) {
    await setSecureJson(COOKIE_JAR_KEY, jar);
  }
}

export async function hasSessionCookie() {
  const jar = await readCookieJar();
  return Object.keys(jar).some((name) => name.includes("authjs.session-token") || name.includes("next-auth.session-token"));
}

async function readCookieJar(): Promise<CookieRecord> {
  return (await getSecureJson<CookieRecord>(COOKIE_JAR_KEY)) ?? {};
}

function getSetCookieHeaders(headers: Headers) {
  const headersWithGetSetCookie = headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headersWithGetSetCookie.getSetCookie === "function") {
    return headersWithGetSetCookie.getSetCookie();
  }

  const headersWithRaw = headers as Headers & { raw?: () => Record<string, string[]> };
  const rawHeaders = typeof headersWithRaw.raw === "function" ? headersWithRaw.raw() : undefined;
  if (rawHeaders?.["set-cookie"]) return rawHeaders["set-cookie"];

  const combined = headers.get("set-cookie");
  return combined ? splitCombinedSetCookie(combined) : [];
}

function parseCookie(header: string) {
  const [pair] = header.split(";");
  const separatorIndex = pair?.indexOf("=") ?? -1;
  if (!pair || separatorIndex <= 0) return null;

  const name = pair.slice(0, separatorIndex).trim();
  if (!isValidCookieName(name)) return null;

  return {
    name,
    value: pair.slice(separatorIndex + 1).trim(),
  };
}

function isExpiredCookie(header: string) {
  return /max-age=0/i.test(header) || /expires=Thu,\s*01 Jan 1970/i.test(header);
}

function splitCombinedSetCookie(value: string) {
  const parts: string[] = [];
  let start = 0;

  for (let index = 0; index < value.length; index += 1) {
    if (value[index] !== ",") continue;

    const nextPart = value.slice(index + 1);
    if (/^\s*[^=;,\s]+=/.test(nextPart)) {
      parts.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }

  parts.push(value.slice(start).trim());
  return parts.filter(Boolean);
}

function sanitizeCookieValue(value: string) {
  return value.split(/,\s*(?=(?:__Secure-|__Host-)?(?:authjs|next-auth)\.[^=;,\s]+=)/)[0]?.trim() ?? "";
}

function isValidCookieName(name: string) {
  return /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(name);
}

function isAuthHandshakeCookie(name: string) {
  return (
    name.includes("authjs.csrf-token") ||
    name.includes("authjs.callback-url") ||
    name.includes("next-auth.csrf-token") ||
    name.includes("next-auth.callback-url")
  );
}
