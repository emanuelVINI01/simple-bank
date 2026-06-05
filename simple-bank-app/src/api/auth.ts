import { requestEmpty, requestJson } from "@/api/client";
import type { ApiUser, AuthSessionPayload, CsrfPayload, LoginInput, RegisterInput } from "@/api/types";
import { clearAuthHandshakeCookies, clearCookieJar } from "@/lib/cookies";

export async function fetchCsrfToken() {
  const payload = await fetchCsrfPayload().catch(async (error) => {
    await clearCookieJar();
    return fetchCsrfPayload().catch(() => {
      throw error;
    });
  });

  return payload.csrfToken;
}

function fetchCsrfPayload() {
  return requestJson<CsrfPayload>("/api/auth/csrf", {
    fallbackMessage: "Nao foi possivel preparar o login.",
  });
}

export async function loginRequest(input: LoginInput) {
  await clearAuthHandshakeCookies();
  const csrfToken = await fetchCsrfToken();
  const body = new URLSearchParams({
    csrfToken,
    email: input.email,
    password: input.password,
    redirect: "false",
    json: "true",
  });

  await requestJson<unknown>("/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    fallbackMessage: "Email ou senha invalidos.",
  });

  return fetchCurrentUser();
}

export async function registerRequest(input: RegisterInput) {
  return requestJson<{ user: ApiUser }>("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    fallbackMessage: "Nao foi possivel criar sua conta.",
  }).then((payload) => payload.user);
}

export async function registerAndLoginRequest(input: RegisterInput) {
  await registerRequest(input);
  return loginRequest({ email: input.email, password: input.password });
}

export function fetchAuthSession() {
  return requestJson<AuthSessionPayload>("/api/auth/session", {
    fallbackMessage: "Nao foi possivel carregar a sessao.",
  });
}

export function fetchCurrentUser() {
  return requestJson<{ user: ApiUser }>("/api/users/me", {
    fallbackMessage: "Nao foi possivel carregar o usuario autenticado.",
  }).then((payload) => payload.user);
}

export async function logoutRequest() {
  const csrfToken = await fetchCsrfToken().catch(() => null);

  if (csrfToken) {
    const body = new URLSearchParams({
      csrfToken,
      redirect: "false",
      json: "true",
    });

    await requestEmpty("/api/auth/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      fallbackMessage: "Nao foi possivel encerrar a sessao.",
    }).catch(() => undefined);
  }

  await clearCookieJar();
}
