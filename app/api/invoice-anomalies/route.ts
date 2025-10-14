import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "node:fs";

export async function GET() {
  // Multiple fallback paths for different environments
  const possiblePaths = [
    "/mnt/data/agents-seed-pack-full/day25_Invoice_Fraud_Anomaly_Detector/invoices.csv",
    "/tmp/agents-seed-pack-full/day25_Invoice_Fraud_Anomaly_Detector/invoices.csv",
    "./data/agents-seed-pack-full/day25_Invoice_Fraud_Anomaly_Detector/invoices.csv"
  ];

  let csvContent = "";
  let foundPath = "";

  // Try each path until we find one that exists
  for (const path of possiblePaths) {
    try {
      if (existsSync(path)) {
        csvContent = readFileSync(path, "utf8");
        foundPath = path;
        break;
      }
    } catch (error) {
      continue;
    }
  }

  // If no file found, use mock data
  if (!csvContent) {
    csvContent = `invoice_id,amount,date,vendor,status
INV-001,15000,2024-01-15,TechCorp,paid
INV-002,25000,2024-01-20,DataSys,pending
INV-003,8500,2024-01-25,CloudServ,paid
INV-004,12000,2024-02-01,DevTools,pending
INV-005,30000,2024-02-05,Enterprise,paid
INV-006,45000,2024-02-10,MegaCorp,paid
INV-007,7500,2024-02-15,StartupInc,pending`;
    foundPath = "mock-data";
  }

  try {
    const csv = csvContent.trim().split(/\r?\n/).map(l => l.split(","));
    const [header, ...rows] = csv;
    const idx = header.indexOf("amount");

    if (idx === -1) {
      return NextResponse.json({
        error: "Amount column not found in CSV",
        source: foundPath
      }, { status: 400 });
    }

    const sorted = rows.map(r => ({
      id: r[0],
      amount: parseFloat(r[idx]),
      vendor: r[3] || "Unknown",
      status: r[4] || "Unknown"
    }))
    .filter(item => !isNaN(item.amount))
    .sort((a,b) => b.amount - a.amount)
    .slice(0,5);

    return NextResponse.json({
      top5: sorted,
      source: foundPath,
      message: foundPath === "mock-data" ? "Using mock data - no invoice file found" : "Invoice data processed successfully"
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to process invoice data",
      details: error instanceof Error ? error.message : "Unknown error",
      source: foundPath
    }, { status: 500 });
  }
}
