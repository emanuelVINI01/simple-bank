import type { Transaction } from "@prisma/client";
import { formatMoney } from "@/lib/format";
import type { PublicUser } from "@/lib/ledger-selects";

type ReceiptTransaction = Transaction & {
  payer: PublicUser | null;
  receiver: PublicUser | null;
};

export function generateReceiptPdf(transaction: ReceiptTransaction) {
  const lines = buildPdfLines(transaction);
  const content = buildPdfContent(lines);
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
  ];

  return Buffer.from(buildPdfDocument(objects));
}

function buildPdfLines(transaction: ReceiptTransaction) {
  return [
    "Simple Bank",
    "Payment receipt",
    `Transaction: ${transaction.id}`,
    `Reference: ${transaction.referenceId}`,
    `Amount: ${formatMoney(transaction.amount)}`,
    `Date: ${transaction.createdAt.toISOString()}`,
    `Payer: ${transaction.payer?.name ?? "Unknown"} (${transaction.payer?.email ?? "hidden"})`,
    `Receiver: ${transaction.receiver?.name ?? "Unknown"} (${transaction.receiver?.email ?? "hidden"})`,
    `Description: ${transaction.description ?? "No description provided"}`,
  ];
}

function buildPdfContent(lines: string[]) {
  return [
    "BT",
    "/F1 22 Tf",
    "50 770 Td",
    `(${escapePdfText(lines[0])}) Tj`,
    "/F1 16 Tf",
    "0 -36 Td",
    `(${escapePdfText(lines[1])}) Tj`,
    "/F1 10 Tf",
    ...lines.slice(2).flatMap((line) => ["0 -24 Td", `(${escapePdfText(line)}) Tj`]),
    "ET",
  ].join("\n");
}

function buildPdfDocument(objects: string[]) {
  const chunks = ["%PDF-1.4\n"];
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(chunks.join("")));
    chunks.push(`${index + 1} 0 obj\n${object}\nendobj\n`);
  });

  const xrefOffset = Buffer.byteLength(chunks.join(""));
  chunks.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach((offset) => {
    chunks.push(`${String(offset).padStart(10, "0")} 00000 n \n`);
  });
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return chunks.join("");
}

function escapePdfText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
