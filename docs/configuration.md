# 🔧 Configuration Guide

This guide covers all configuration options for the 30 Agents Starter Repository.

## Environment Variables

### Core Configuration

Copy the environment template and configure your keys:

```bash
cp data/agents-seed-pack-full/.env.example .env.local
```

### Essential Variables

#### AI/LLM Services
```bash
# OpenRouter - Multi-model LLM access (Required)
OPENROUTER_API_KEY=sk-or-v1-xxxxx
# Get from: https://openrouter.ai/

# Helicone - LLM monitoring and analytics (Recommended)
HELICONE_API_KEY=sk-helicone-xxxxx
# Get from: https://helicone.ai/
```

#### Database
```bash
# Supabase - PostgreSQL database (Optional for basic usage)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Get from: https://supabase.com/
```

### Communication Services

#### Email
```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SendGrid (Alternative)
SENDGRID_API_KEY=SG.xxxxx
```

#### Messaging Platforms
```bash
# Slack
SLACK_BOT_TOKEN=xoxb-xxxxx
SLACK_SIGNING_SECRET=xxxxx

# WhatsApp Business API
WHATSAPP_TOKEN=xxxxx
WHATSAPP_PHONE_ID=xxxxx

# Microsoft Teams
TEAMS_BOT_ID=xxxxx
TEAMS_BOT_PASSWORD=xxxxx
```

### Google Services

#### OAuth Configuration
```bash
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

#### Required Scopes
```bash
# Calendar access
# https://www.googleapis.com/auth/calendar

# Drive access (read-only)
# https://www.googleapis.com/auth/drive.readonly

# Documents access
# https://www.googleapis.com/auth/documents
```

### CRM & Helpdesk

#### Salesforce
```bash
SALESFORCE_CLIENT_ID=xxxxx
SALESFORCE_CLIENT_SECRET=xxxxx
SALESFORCE_USERNAME=your-username
SALESFORCE_PASSWORD=your-password
SALESFORCE_SECURITY_TOKEN=xxxxx
```

#### HubSpot
```bash
HUBSPOT_API_KEY=pat-na1-xxxxx
# Get from: HubSpot Settings > Integrations > API Key
```

#### Zendesk
```bash
ZENDESK_SUBDOMAIN=your-company
ZENDESK_TOKEN=xxxxx
# Format: https://your-company.zendesk.com
```

#### Freshdesk
```bash
FRESHDESK_DOMAIN=your-company.freshdesk.com
FRESHDESK_API_KEY=xxxxx
```

### Development Tools

#### GitHub
```bash
GITHUB_TOKEN=ghp_xxxxx
# For accessing repositories and creating issues
```

#### Intercom
```bash
INTERCOM_ACCESS_TOKEN=dG9rOjxxxxx
# For customer support integration
```

### Mobile App Stores

#### Apple App Store Connect
```bash
ASC_ISSUER_ID=xxxxx
ASC_KEY_ID=xxxxx
ASC_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
```

#### Google Play Console
```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
# Service account JSON file for Android Publisher API
```

### Travel & Expense APIs

#### Amadeus (Flight/Hotel APIs)
```bash
AMADEUS_API_KEY=xxxxx
AMADEUS_API_SECRET=xxxxx
```

#### Skyscanner
```bash
SKYSCANNER_API_KEY=xxxxx
```

#### Concur (Expense Management)
```bash
CONCUR_CLIENT_ID=xxxxx
CONCUR_CLIENT_SECRET=xxxxx
```

### Social Media & News

#### News API
```bash
NEWSAPI_KEY=xxxxx
# Get from: https://newsapi.org/
```

#### Reddit API
```bash
REDDIT_CLIENT_ID=xxxxx
REDDIT_CLIENT_SECRET=xxxxx
REDDIT_USER_AGENT=yourapp/1.0 by yourusername
```

### Security & Compliance

#### Google Cloud (DLP API)
```bash
GCP_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS_DLP=/path/to/dlp-service-account.json
```

#### AWS (Security Services)
```bash
AWS_ACCESS_KEY_ID=AKIAXXXXX
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=us-east-1
```

## Configuration Best Practices

### 1. Security
- **Never commit `.env.local`** to version control
- Use **different keys** for development and production
- **Rotate keys** quarterly or after any security incident
- Use **least-privilege** access for all API keys

### 2. Environment Management
```bash
# Development
.env.local

# Staging
.env.staging

# Production
.env.production
```

### 3. Key Management
- Store production keys in secure vaults (AWS Secrets Manager, Azure Key Vault)
- Use environment-specific key prefixes
- Document key purposes and renewal dates

## Agent-Specific Configuration

### Payment Follow-Up Agent
```yaml
# data/agents-seed-pack-full/day01_Smart_Payment_Follow-Up/policy.yaml
grace_days: 3
sequence:
  - channel: whatsapp
    template: "Hi {{name}}, invoice {{number}} is due {{due_date}}."
  - wait_hours: 48
  - channel: email
    subject: "Payment reminder: {{number}}"
  - wait_hours: 72
  - escalate_to: "finance@yourco.com"
```

### Support Router Agent
```yaml
# data/agents-seed-pack-full/day21_Support_Summarizer_and_Router/router_policy.yaml
intents:
  billing: group_billing
  login: group_auth
  bug: group_engineering
vip_overrides: true
```

### Lead Scoring Agent
```json
{
  "industry_boost": {
    "FinTech": 10,
    "Healthcare": 8,
    "Enterprise": 6
  },
  "title_seniority": {
    "CEO": 10,
    "VP": 8,
    "Director": 6,
    "Manager": 4
  }
}
```

## Database Configuration

### Supabase Setup

1. **Create Project**
   ```bash
   # Visit https://supabase.com/dashboard
   # Create new project
   # Note down URL and keys
   ```

2. **Database Schema**
   ```sql
   -- Example tables for agents
   CREATE TABLE agent_runs (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     agent_name TEXT NOT NULL,
     input_data JSONB,
     output_data JSONB,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE agent_configs (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     agent_name TEXT UNIQUE NOT NULL,
     config JSONB NOT NULL,
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Row Level Security (RLS)**
   ```sql
   -- Enable RLS
   ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE agent_configs ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view their own runs" ON agent_runs
     FOR SELECT USING (auth.uid() = user_id);
   ```

## API Rate Limiting

### OpenRouter Limits
- **Free Tier**: 20 requests/minute
- **Paid Tier**: 200+ requests/minute
- **Enterprise**: Custom limits

### Implementation
```typescript
// lib/rate-limiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
  return { success, limit, reset, remaining };
}
```

## Monitoring Configuration

### Helicone Setup
```typescript
// lib/helicone.ts
import { HeliconeAPIClient } from "@helicone/helicone";

const helicone = new HeliconeAPIClient({
  apiKey: process.env.HELICONE_API_KEY!,
});

export async function logLLMRequest(request: any, response: any) {
  await helicone.logRequest({
    request,
    response,
    properties: {
      agent: "meeting-actions",
      environment: process.env.NODE_ENV,
    },
  });
}
```

### Error Tracking
```typescript
// lib/error-tracking.ts
export function logError(error: Error, context: any) {
  console.error("Agent Error:", {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
  
  // Send to monitoring service
  // Sentry, DataDog, etc.
}
```

## Deployment Configuration

### Vercel
```json
{
  "env": {
    "OPENROUTER_API_KEY": "@openrouter-api-key",
    "HELICONE_API_KEY": "@helicone-api-key"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

### Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting Configuration

### Common Issues

1. **API Key Not Working**
   - Check key format and validity
   - Verify environment variable name
   - Restart development server

2. **Database Connection Failed**
   - Verify Supabase URL and keys
   - Check network connectivity
   - Validate database permissions

3. **External API Errors**
   - Check API quotas and limits
   - Verify OAuth scopes
   - Test with API documentation

### Debug Mode
```bash
# Enable debug logging
DEBUG=true npm run dev

# Verbose API logging
VERBOSE_LOGGING=true npm run dev
```

This configuration guide should help you set up all the necessary services and integrations for your agents. Remember to follow security best practices and keep your API keys secure!
