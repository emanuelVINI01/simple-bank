export function maskTaxId(taxId: string) {
  const digits = taxId.replace(/\D/g, "");
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 2)}****${digits.slice(-2)}`;
}

export function formatTaxId(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}-${digits.slice(5)}`;
}

export function unformatTaxId(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;

  const visible = name.length <= 2 ? name.slice(0, 1) : name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(name.length - visible.length, 2))}@${domain}`;
}

export function getFirstName(name?: string | null) {
  return name?.trim().split(/\s+/)[0] ?? "";
}

export function getInitials(name?: string | null) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  const first = parts[0]?.[0] ?? "S";
  const second = parts[1]?.[0] ?? "B";
  return `${first}${second}`.toUpperCase();
}
