# 🤖 Agent Development Guide

**Complete guide for developing and working with individual agents in the 30 Agents Starter Repository**

## Overview

This repository contains 30 production-ready AI agents, each designed to solve specific business problems. This guide shows you how to:

- 🔍 **Explore existing agents** and their demo data
- 🛠️ **Develop new agents** using the standardized framework
- 📊 **Access demo data** for testing and development
- 🚀 **Deploy agents** to production

## Quick Start

### 1. Explore Available Agents

```bash
# Get list of all agents
curl http://localhost:3000/api/agents

# Get agents by category
curl http://localhost:3000/api/agents?category=Financial

# Get specific agent info
curl http://localhost:3000/api/agents?agent=invoice-anomalies
```

### 2. Access Agent Demo Data

```bash
# Get all demo data for an agent
curl http://localhost:3000/api/agents/invoice-anomalies/data

# Get specific data file
curl http://localhost:3000/api/agents/invoice-anomalies/data?file=invoices.csv

# Get raw data file
curl http://localhost:3000/api/agents/invoice-anomalies/data?file=invoices.csv&format=raw
```

### 3. Test Agent Functionality

```bash
# Test implemented agent
curl -X POST http://localhost:3000/api/agents/invoice-anomalies/data \
  -H "Content-Type: application/json" \
  -d '{"customData": "test"}'
```

## Agent Registry System

### Agent Configuration

Each agent is defined in `/lib/agent-registry.ts`:

```typescript
'invoice-anomalies': {
  id: 'invoice-anomalies',
  name: 'Invoice Fraud Anomaly Detector',
  dayFolder: 'day25_Invoice_Fraud_Anomaly_Detector',
  apiRoute: '/api/invoice-anomalies',
  description: 'Invoice fraud detection and anomaly analysis',
  dataFiles: ['invoices.csv', 'vendors.csv'],
  category: 'Financial',
  complexity: 5,
  status: 'implemented'
}
```

### Data Access System

The standardized data access system (`/lib/data-access.ts`) provides:

- **Automatic fallback paths** - Tries multiple locations for data files
- **Mock data generation** - Provides realistic test data when files are missing
- **Type-safe parsing** - Automatic CSV, JSON, XML, and text parsing
- **Error handling** - Graceful degradation with detailed error messages

## Working with Individual Agents

### 1. Choose an Agent to Work On

```bash
# List all planned agents (not yet implemented)
curl http://localhost:3000/api/agents?status=planned
```

### 2. Examine Agent Structure

Each agent has:
- **Data folder**: `/data/agents-seed-pack-full/day{XX}_{Agent_Name}/`
- **Demo data files**: CSV, JSON, XML, or text files with realistic test data
- **Documentation**: `/docs/agents/day{XX}-{agent-name}.md`
- **API route**: `/app/api/{agent-route}/route.ts`

### 3. Access Demo Data

```typescript
// Using the data access system
import { loadCSVData, loadJSONData, getAgentDemoData } from "@/lib/data-access";

// Load specific file
const invoices = await loadCSVData('invoice-anomalies', 'invoices.csv');

// Load all demo data for an agent
const allData = await getAgentDemoData('invoice-anomalies');
```

### 4. Implement Agent API

Create `/app/api/{agent-route}/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { loadCSVData, MockDataGenerators } from "@/lib/data-access";

export async function GET() {
  // Load demo data with automatic fallback
  const result = await loadCSVData(
    'your-agent-id', 
    'data-file.csv', 
    MockDataGenerators.yourDataType()
  );

  if (!result.success) {
    return NextResponse.json({
      error: result.error,
      source: result.source
    }, { status: 500 });
  }

  // Process data with your agent logic
  const processedData = processWithAgentLogic(result.data);

  return NextResponse.json({
    result: processedData,
    source: result.source,
    agent: {
      id: 'your-agent-id',
      name: 'Your Agent Name'
    }
  });
}
```

## Agent Categories and Examples

### 📊 Financial Agents
- **Invoice Fraud Detector** - Detects anomalies in invoice data
- **Expense Parser** - Categorizes and parses expense receipts
- **PO-GRN Reconciler** - Three-way matching for purchase orders

### 📈 Marketing Agents  
- **SEO Sentinel** - SEO analysis and optimization
- **Social Listening** - Crisis detection from social media
- **Landing Page Fixer** - Page optimization and monitoring

### 🎯 Sales Agents
- **Lead Enrichment** - Lead scoring and ICP matching
- **Pipeline Nurture** - Automated lead nurturing
- **Proposal Scope Guard** - Proposal validation

### 🛠️ Operations Agents
- **Vendor SLA Watchdog** - SLA monitoring and tracking
- **Inventory Forecaster** - Demand forecasting
- **Calendar Load Balancer** - Meeting optimization

### 👥 HR Agents
- **Employee Onboarding** - Automated onboarding assistance
- **HR Policy QA** - Policy questions and triage

### 🔒 Security Agents
- **Security Posture Nanny** - Security monitoring
- **PII Finder** - Data retention management

### 📞 Support Agents
- **Support Summarizer** - Ticket summarization and routing
- **KB Gap Filler** - Knowledge base optimization

## Development Workflow

### 1. Planning Phase
```bash
# Validate agent configuration
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{"action": "validate", "agentId": "your-agent-id"}'
```

### 2. Development Phase
```bash
# Test with demo data
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{"action": "test", "agentId": "your-agent-id"}'
```

### 3. Testing Phase
```bash
# Run agent tests
npm test -- --grep "your-agent-name"

# Test API endpoint
curl http://localhost:3000/api/your-agent-route
```

## Demo Data Structure

### CSV Files (invoices.csv, vendors.csv, etc.)
```csv
invoice_id,vendor,date,amount,iban,created_at_utc
I-1,Delta,2025-09-16,1500.00,GB33BUKB20201555555555,2025-10-08T04:51:21.020403Z
```

### JSON Files (tickets.json, actions.json, etc.)
```json
[
  {
    "id": "TICKET-001",
    "subject": "Billing Issue",
    "priority": "high",
    "status": "open"
  }
]
```

### Text Files (transcript.txt, etc.)
```
Meeting Transcript - Project Planning Session

John: We need to finalize the budget by Friday. @Sarah can you prepare the financial report?
```

### XML Files (sitemap.xml, etc.)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
  </url>
</urlset>
```

## Best Practices

### 1. Data Access
- ✅ **Always use the data access system** - Don't hardcode file paths
- ✅ **Provide mock data fallbacks** - Ensure agents work without files
- ✅ **Handle errors gracefully** - Return meaningful error messages
- ✅ **Use appropriate parsers** - CSV, JSON, XML, text based on file type

### 2. API Design
- ✅ **Follow REST conventions** - GET for retrieval, POST for processing
- ✅ **Return consistent responses** - Include agent info and data source
- ✅ **Provide helpful metadata** - Links to data access endpoints
- ✅ **Handle edge cases** - Empty data, missing columns, etc.

### 3. Testing
- ✅ **Test with real demo data** - Use the actual data files
- ✅ **Test with mock data** - Ensure fallbacks work
- ✅ **Test error conditions** - Missing files, invalid data
- ✅ **Test API endpoints** - Both success and error cases

### 4. Documentation
- ✅ **Update agent registry** - Keep configuration current
- ✅ **Document data requirements** - Specify expected file formats
- ✅ **Provide usage examples** - Show how to use the agent
- ✅ **Include business context** - Explain the problem being solved

## Team Collaboration

### For Team Members

1. **Pick an agent** from the planned list
2. **Study the documentation** in `/docs/agents/`
3. **Examine the demo data** in `/data/agents-seed-pack-full/`
4. **Implement the API route** using the standardized system
5. **Test thoroughly** with both real and mock data
6. **Update the registry** to mark as implemented

### For Project Managers

- **Track progress** using agent status in the registry
- **Monitor implementation** via the agents API
- **Review documentation** for business impact and ROI
- **Coordinate priorities** based on agent complexity and category

## Advanced Features

### Custom Mock Data Generators

```typescript
// Add to MockDataGenerators in data-access.ts
customDataType: (count: number = 10) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ITEM-${i + 1}`,
    value: Math.random() * 1000,
    timestamp: new Date().toISOString()
  }));
}
```

### Agent Orchestration

```typescript
// Combine multiple agents
const invoiceData = await loadCSVData('invoice-anomalies', 'invoices.csv');
const vendorData = await loadCSVData('vendor-sla-watchdog', 'vendors.csv');

// Cross-agent analysis
const combinedAnalysis = analyzeInvoicesWithVendorSLA(invoiceData, vendorData);
```

## Deployment Checklist

- [ ] Agent implemented and tested
- [ ] Demo data accessible via API
- [ ] Documentation updated
- [ ] Tests passing
- [ ] Registry status updated to 'implemented'
- [ ] API endpoints responding correctly
- [ ] Error handling implemented
- [ ] Mock data fallbacks working

This guide provides everything you need to work with individual agents and build full-fledged AI solutions using the 30 Agents Starter Repository framework.
