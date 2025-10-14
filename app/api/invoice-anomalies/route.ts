import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";

export async function GET() {
  const path = "/mnt/data/agents-seed-pack-full/day25_Invoice_Fraud_Anomaly_Detector/invoices.csv";
  const csv = readFileSync(path, "utf8").trim().split(/\r?\n/).map(l => l.split(","));
  const [header, ...rows] = csv;
  const idx = header.indexOf("amount");
  const sorted = rows.map(r => ({ id:r[0], amount: parseFloat(r[idx]) }))
    .sort((a,b) => b.amount - a.amount).slice(0,5);
  return NextResponse.json({ top5: sorted });
}
