# 📖 API Reference

Complete API documentation for all 30 agents in the starter repository.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require API key authentication:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     https://your-domain.com/api/endpoint
```

## Common Response Format

All endpoints return JSON responses with consistent structure:

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "meta": {
    "timestamp": "2025-10-14T10:30:00Z",
    "processing_time_ms": 150,
    "agent": "meeting-actions",
    "version": "1.0.0"
  }
}
```

## Error Responses

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "due_date",
      "issue": "Invalid date format"
    }
  },
  "meta": {
    "timestamp": "2025-10-14T10:30:00Z",
    "request_id": "req_123456"
  }
}
```

## Finance & Accounting Agents

### Smart Payment Follow-Up
**POST** `/api/payment-follow-up`

Automates invoice payment reminders with multi-channel escalation.

#### Request Body
```json
{
  "invoices": [
    {
      "id": "inv-1001",
      "number": "INV-1001",
      "contact_id": "c-49",
      "amount": 2159.97,
      "currency": "USD",
      "due_date": "2025-09-11",
      "status": "open"
    }
  ],
  "policy": {
    "grace_days": 3,
    "sequence": [
      {
        "channel": "whatsapp",
        "template": "Hi {{name}}, invoice {{number}} is due {{due_date}}."
      }
    ]
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "processed_invoices": 5,
    "reminders_sent": 3,
    "escalations": 1,
    "results": [
      {
        "invoice_id": "inv-1001",
        "action": "reminder_sent",
        "channel": "whatsapp",
        "status": "delivered"
      }
    ]
  }
}
```

### Invoice Anomaly Detector
**GET** `/api/invoice-anomalies`

Detects suspicious invoices and potential fraud.

#### Query Parameters
- `limit` (optional): Number of top anomalies to return (default: 5)
- `threshold` (optional): Risk threshold (0.0-1.0, default: 0.7)

#### Response
```json
{
  "success": true,
  "data": {
    "top5": [
      {
        "id": "I-6",
        "amount": 25000.00,
        "risk_score": 0.85,
        "anomalies": ["amount_outlier", "round_amount"]
      }
    ],
    "total_analyzed": 202,
    "high_risk_count": 8
  }
}
```

## Sales & Marketing Agents

### Meeting Action Enforcer
**POST** `/api/meeting-actions`

Extracts action items from meeting transcripts.

#### Request Body
```json
{
  "transcript": "Meeting transcript text...",
  "meeting_id": "meet-123",
  "attendees": ["john@company.com", "jane@company.com"]
}
```

#### Response
```json
{
  "success": true,
  "data": [
    {
      "owner": "Mina",
      "title": "Prepare pricing sheet",
      "due": "2025-10-20",
      "priority": "high",
      "context": "Q4 GTM Strategy"
    }
  ]
}
```

### SEO Issue Sentinel
**GET** `/api/seo-pages`

Analyzes sitemap and returns URL list for SEO monitoring.

#### Query Parameters
- `sitemap_url` (optional): Custom sitemap URL
- `include_meta` (optional): Include meta information (default: false)

#### Response
```json
{
  "success": true,
  "data": {
    "count": 156,
    "urls": [
      "https://example.com/",
      "https://example.com/about",
      "https://example.com/pricing"
    ],
    "last_modified": "2025-10-14T08:00:00Z"
  }
}
```

## HR & Operations Agents

### Support Summarizer & Router
**POST** `/api/support-brief`

Generates structured briefs from support tickets.

#### Request Body
```json
{
  "ticket_data": {
    "subject": "Billing issue - charged twice",
    "description": "Customer was charged twice for the same service",
    "priority": "high",
    "customer_tier": "enterprise"
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "issue": "Billing issue",
    "env": "prod",
    "steps_tried": "Charged twice; Refund requested",
    "severity": "high",
    "next_action": "Route to Billing",
    "estimated_resolution_time": "2 hours"
  }
}
```

### Employee Onboarding Buddy
**POST** `/api/onboarding-buddy`

Manages personalized employee onboarding workflows.

#### Request Body
```json
{
  "employee": {
    "name": "John Doe",
    "email": "john.doe@company.com",
    "department": "Engineering",
    "start_date": "2025-10-20",
    "role": "Senior Developer"
  },
  "customizations": {
    "skip_basic_training": false,
    "include_mentorship": true
  }
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "onboarding_plan": {
      "total_tasks": 25,
      "estimated_duration": "2 weeks",
      "milestones": [
        {
          "day": 1,
          "tasks": ["IT setup", "Welcome meeting", "Handbook review"]
        }
      ]
    },
    "assigned_buddy": "jane.smith@company.com"
  }
}
```

## Analytics & Compliance Agents

### Inventory Demand Forecaster
**POST** `/api/inventory-forecast`

Predicts inventory needs using sales data and ML models.

#### Request Body
```json
{
  "sales_data": [
    {
      "product_id": "PROD-001",
      "date": "2025-10-01",
      "quantity_sold": 15,
      "revenue": 1500.00
    }
  ],
  "forecast_period": "30_days",
  "confidence_level": 0.95
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "forecasts": [
      {
        "product_id": "PROD-001",
        "predicted_demand": 450,
        "confidence_interval": [380, 520],
        "reorder_point": 100,
        "recommended_order_quantity": 300
      }
    ],
    "model_accuracy": 0.87
  }
}
```

### Compliance Calendar
**GET** `/api/compliance-calendar`

Tracks compliance deadlines and requirements.

#### Query Parameters
- `jurisdiction` (optional): Filter by jurisdiction (US, EU, etc.)
- `category` (optional): Filter by category (tax, privacy, etc.)
- `upcoming_days` (optional): Days ahead to look (default: 30)

#### Response
```json
{
  "success": true,
  "data": {
    "upcoming_deadlines": [
      {
        "deadline": "2025-10-31",
        "requirement": "GST Return Filing",
        "jurisdiction": "IN",
        "category": "tax",
        "days_remaining": 17,
        "status": "pending"
      }
    ],
    "overdue_count": 0,
    "total_tracked": 45
  }
}
```

## Webhook Endpoints

### Meeting Platform Webhooks

#### Zoom Webhook
**POST** `/api/webhooks/zoom`

Receives Zoom meeting completion notifications.

```json
{
  "event": "recording.completed",
  "payload": {
    "meeting_id": "123456789",
    "recording_files": [
      {
        "download_url": "https://zoom.us/rec/download/...",
        "file_type": "MP4"
      }
    ]
  }
}
```

#### Teams Webhook
**POST** `/api/webhooks/teams`

Receives Microsoft Teams meeting notifications.

### External Service Webhooks

#### Slack Events
**POST** `/api/webhooks/slack`

Handles Slack app events and interactions.

#### GitHub Webhooks
**POST** `/api/webhooks/github`

Processes GitHub repository events for changelog agents.

## Rate Limiting

All endpoints are rate limited:

- **Free tier**: 100 requests/hour
- **Pro tier**: 1,000 requests/hour
- **Enterprise**: Custom limits

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1634567890
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { AgentsClient } from '@agents-starter/sdk';

const client = new AgentsClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://your-domain.com/api'
});

// Extract meeting actions
const actions = await client.meetingActions.extract({
  transcript: 'Meeting transcript...'
});

// Detect invoice anomalies
const anomalies = await client.invoiceAnomalies.detect({
  invoices: invoiceData
});
```

### Python
```python
from agents_starter import AgentsClient

client = AgentsClient(
    api_key='your-api-key',
    base_url='https://your-domain.com/api'
)

# Extract meeting actions
actions = client.meeting_actions.extract(
    transcript='Meeting transcript...'
)

# Detect invoice anomalies
anomalies = client.invoice_anomalies.detect(
    invoices=invoice_data
)
```

### cURL Examples

#### Extract Meeting Actions
```bash
curl -X POST https://your-domain.com/api/meeting-actions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Meeting: Q4 Strategy\nActions:\n- @John prepare report by Friday"
  }'
```

#### Get Invoice Anomalies
```bash
curl -X GET "https://your-domain.com/api/invoice-anomalies?limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid input data |
| `AUTHENTICATION_ERROR` | Invalid or missing API key |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `PROCESSING_ERROR` | Internal processing error |
| `EXTERNAL_API_ERROR` | External service unavailable |
| `INSUFFICIENT_CREDITS` | Not enough API credits |

## Pagination

For endpoints returning large datasets:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 1250,
    "total_pages": 25,
    "has_next": true,
    "has_prev": false
  }
}
```

Use `page` and `per_page` query parameters:
```
GET /api/endpoint?page=2&per_page=100
```

## Testing

Use the included Postman collection for testing:

1. Import `postman/30-agents-common.postman_collection.json`
2. Set up environment variables
3. Run test requests

For automated testing:
```bash
npm test  # Run all API tests
npm run test:api  # Run specific API tests
```
