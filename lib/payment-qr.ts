export type PaymentQrData = {
  amount?: number;
  description?: string;
  key: string;
};

const QR_SCHEME = "simplebank://pay";

export function buildPaymentQrPayload(input: PaymentQrData) {
  const params = new URLSearchParams({ key: input.key });

  if (Number.isInteger(input.amount) && input.amount && input.amount > 0) {
    params.set("amount", String(input.amount));
  }

  const description = input.description?.trim();
  if (description) {
    params.set("description", description.slice(0, 255));
  }

  return `${QR_SCHEME}?${params.toString()}`;
}

export function parseCurrencyToCents(value: string) {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);

  if (!Number.isFinite(amount)) return undefined;
  const cents = Math.round(amount * 100);
  return cents > 0 ? cents : undefined;
}
