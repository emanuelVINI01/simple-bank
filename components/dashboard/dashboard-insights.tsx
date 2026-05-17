"use client";

const insights = [
  {
    text: "Duplicate clicks are disabled in the payment modal and every new attempt generates an Idempotency-Key header.",
    title: "Why this matters",
  },
  {
    text: "Reference IDs and paired debit/credit rows make the transaction flow inspectable after execution.",
    title: "Auditability",
  },
  {
    text: "The app surfaces auth, retry, empty and error states without exposing raw failures.",
    title: "Operational UX",
  },
  {
    text: "Next.js owns the interface, API routes, Auth.js session handling and Prisma-backed ledger rules.",
    title: "One deployable app",
  },
];

export function DashboardInsights() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {insights.map((item) => (
        <article key={item.title} className="glass-surface-2 rounded-xl p-5">
          <h3 className="text-lg font-bold text-white">{item.title}</h3>
          <p className="mt-3 text-sm leading-6 text-[#a7b0c8]">{item.text}</p>
        </article>
      ))}
    </div>
  );
}
