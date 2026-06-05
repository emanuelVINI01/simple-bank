import type { ApiErrorPayload } from "@/api/types";

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(message: string, status: number, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function getApiErrorMessage(payload: unknown, fallbackMessage: string) {
  if (!payload || typeof payload !== "object") return fallbackMessage;

  const errorPayload = payload as ApiErrorPayload;
  return errorPayload.message ?? errorPayload.error ?? fallbackMessage;
}

