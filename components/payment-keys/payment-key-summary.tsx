export function PaymentKeySummary({ ownerTaxId, totalKeys }: { ownerTaxId: string; totalKeys: number }) {
  return (
    <section className="mb-6 grid gap-4 sm:grid-cols-3">
      <MetricCard label="Active keys" value={String(totalKeys)} />
      <MetricCard label="Owner tax ID" value={ownerTaxId} />
      <MetricCard label="Security" value="Auth.js JWT" />
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-surface-2 rounded-xl p-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a7b0c8]">{label}</p>
      <p className="mt-3 break-all text-xl font-black text-white">{value}</p>
    </div>
  );
}
