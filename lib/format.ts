export function formatMoney(value?: number | null) {
  const cents = Number.isFinite(value) ? Number(value) : 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatDate(value?: string) {
  if (!value) return "No activity yet";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function onlyDigits(value?: string) {
  return (value ?? "").replace(/\D/g, "");
}

export function formatTaxId(value?: string) {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}/${digits.slice(6, 8)}`;
}

export function maskEmail(email?: string) {
  if (!email) return "hidden";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 2)}***@${domain}`;
}

export function maskKey(key: string) {
  if (key.length <= 8) return key;
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

export function makeIdempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `idem_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
