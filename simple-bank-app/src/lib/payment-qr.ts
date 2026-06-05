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

export function parsePaymentQrPayload(value: string): PaymentQrData | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "simplebank:" || url.hostname !== "pay") return null;

    const key = url.searchParams.get("key")?.trim();
    if (!key) return null;

    const amountParam = url.searchParams.get("amount");
    const amount = amountParam ? Number(amountParam) : undefined;
    const description = url.searchParams.get("description")?.trim() || undefined;

    return {
      amount: Number.isInteger(amount) && amount && amount > 0 ? amount : undefined,
      description,
      key,
    };
  } catch {
    return null;
  }
}

export function formatCentsForInput(cents?: number) {
  if (!cents) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}
