import { NextRequest, NextResponse } from "next/server";
import { loadCSVData, MockDataGenerators } from "@/lib/data-access";

export async function GET() {
  // Use standardized data access system
  const result = await loadCSVData(
    'invoice-anomalies',
    'invoices.csv',
    MockDataGenerators.invoices(20)
  );

  if (!result.success) {
    return NextResponse.json({
      error: result.error || "Failed to load invoice data",
      source: result.source
    }, { status: 500 });
  }

  try {
    const invoices = result.data;

    // Find amount column (flexible column detection)
    const amountField = Object.keys(invoices[0] || {}).find(key =>
      key.toLowerCase().includes('amount')
    );

    if (!amountField) {
      return NextResponse.json({
        error: "Amount column not found in invoice data",
        source: result.source,
        availableFields: Object.keys(invoices[0] || {})
      }, { status: 400 });
    }

    // Process and sort invoices by amount
    const sorted = invoices
      .map(invoice => ({
        id: invoice.invoice_id || invoice.id || 'Unknown',
        amount: parseFloat(invoice[amountField]) || 0,
        vendor: invoice.vendor || 'Unknown',
        status: invoice.status || 'Unknown',
        date: invoice.date || 'Unknown'
      }))
      .filter(item => !isNaN(item.amount) && item.amount > 0)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return NextResponse.json({
      top5: sorted,
      source: result.source,
      totalInvoices: invoices.length,
      message: result.source === "mock-data"
        ? "Using mock data - no invoice file found"
        : "Invoice data processed successfully",
      agent: {
        id: 'invoice-anomalies',
        name: 'Invoice Fraud Anomaly Detector',
        description: 'Analyzes invoices for fraud detection and anomaly identification'
      },
      dataAccess: {
        allData: '/api/agents/invoice-anomalies/data',
        rawInvoices: '/api/agents/invoice-anomalies/data?file=invoices.csv'
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to process invoice data",
      details: error instanceof Error ? error.message : "Unknown error",
      source: result.source
    }, { status: 500 });
  }
}
