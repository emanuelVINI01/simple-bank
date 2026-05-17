export async function probeApiHealth() {
  const response = await fetch("/api/health", { credentials: "same-origin" });
  const data = await response.json() as { ok?: boolean };

  return response.ok && Boolean(data.ok);
}
