import { beforeAll } from 'vitest';
import { writeFileSync, mkdirSync } from 'fs';

beforeAll(async () => {
  // Create mock data directories for CI environment
  const mockDataDir = '/tmp/agents-seed-pack-full';
  
  try {
    // Create directories
    mkdirSync(`${mockDataDir}/day08_Meeting_Action_Enforcer`, { recursive: true });
    mkdirSync(`${mockDataDir}/day25_Invoice_Fraud_Anomaly_Detector`, { recursive: true });
    mkdirSync(`${mockDataDir}/day15_SEO_Sentinel`, { recursive: true });
    mkdirSync(`${mockDataDir}/day01_Smart_Payment_Follow-Up`, { recursive: true });

    // Create mock transcript file
    const mockTranscript = `Meeting: Q4 Strategy Planning
@Mina prepare pricing sheet by Oct 20
@Raj update pitch deck by Oct 18  
@Priya schedule beta calls by Oct 16
Discussion about market expansion and competitive analysis.`;

    writeFileSync(`${mockDataDir}/day08_Meeting_Action_Enforcer/transcript.txt`, mockTranscript);

    // Create mock invoice CSV
    const mockInvoiceCSV = `invoice_id,amount,date,vendor,status
INV-001,15000,2024-01-15,TechCorp,paid
INV-002,25000,2024-01-20,DataSys,pending
INV-003,8500,2024-01-25,CloudServ,paid
INV-004,12000,2024-02-01,DevTools,pending
INV-005,30000,2024-02-05,Enterprise,paid`;

    writeFileSync(`${mockDataDir}/day25_Invoice_Fraud_Anomaly_Detector/invoices.csv`, mockInvoiceCSV);

    // Create mock sitemap XML
    const mockSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2024-01-02</lastmod>
  </url>
  <url>
    <loc>https://example.com/products</loc>
    <lastmod>2024-01-03</lastmod>
  </url>
</urlset>`;

    writeFileSync(`${mockDataDir}/day15_SEO_Sentinel/sitemap.xml`, mockSitemap);

    // Create mock tickets JSON
    const mockTickets = JSON.stringify([
      {
        id: 1,
        title: "Billing Issue",
        description: "Customer cannot access premium features after payment",
        priority: "high",
        status: "open",
        created_at: "2024-01-15T10:00:00Z"
      },
      {
        id: 2,
        title: "Login Problem",
        description: "User unable to login with correct credentials",
        priority: "medium",
        status: "in_progress",
        created_at: "2024-01-16T14:30:00Z"
      }
    ], null, 2);

    writeFileSync(`${mockDataDir}/day01_Smart_Payment_Follow-Up/tickets.json`, mockTickets);

    console.log('Mock data created successfully for CI environment');
  } catch (error) {
    console.log('Mock data creation failed (expected in non-CI environments):', error);
  }
}, 30000);
