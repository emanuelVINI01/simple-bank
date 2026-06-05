const brlFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
});

const fullDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatMoney(cents?: number | null) {
  return brlFormatter.format((cents ?? 0) / 100);
}

export function parseMoneyToCents(value: string) {
  const normalized = value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const amount = Number(normalized);

  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100);
}

export function formatDateTime(iso: string) {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatFullDate(iso: string) {
  return fullDateFormatter.format(new Date(iso));
}

export function formatShortReference(referenceId: string) {
  if (referenceId.length <= 12) return referenceId;
  return `${referenceId.slice(0, 8)}...${referenceId.slice(-4)}`;
}

