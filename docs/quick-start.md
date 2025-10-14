# 🚀 Quick Start Guide

Get up and running with the 30 Agents Starter Repository in under 10 minutes!

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/indranilbanerjee/hackathon-agents-starter.git
cd hackathon-agents-starter

# Install dependencies
npm install

# Copy environment template
cp data/agents-seed-pack-full/.env.example .env.local
```

## Step 2: Configure Environment Variables

Edit `.env.local` with your API keys. Start with these essential ones:

```bash
# Core AI Services (Required)
OPENROUTER_API_KEY=your_openrouter_key_here
HELICONE_API_KEY=your_helicone_key_here

# Database (Optional for basic testing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
```

### Getting API Keys

#### OpenRouter (Required)
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to API Keys section
4. Create a new API key
5. Add credits to your account ($5 minimum recommended)

#### Helicone (Optional but Recommended)
1. Visit [Helicone.ai](https://helicone.ai/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Provides LLM usage monitoring and analytics

#### Supabase (Optional)
1. Visit [Supabase.com](https://supabase.com/)
2. Create a new project
3. Get your URL and keys from project settings
4. Required for persistent data storage

## Step 3: Start Development Server

```bash
# Start the development server
npm run dev

# Server will start at http://localhost:3000
```

## Step 4: Test Your Setup

### Option A: Using cURL

```bash
# Test Meeting Action Enforcer
curl -X POST http://localhost:3000/api/meeting-actions \
  -H "Content-Type: application/json" \
  -d '{}'

# Test Invoice Anomaly Detector
curl http://localhost:3000/api/invoice-anomalies

# Test Support Brief Generator
curl -X POST http://localhost:3000/api/support-brief \
  -H "Content-Type: application/json" \
  -d '{}'

# Test SEO Page Crawler
curl http://localhost:3000/api/seo-pages
```

### Option B: Using Postman

1. Import the collection from `postman/30-agents-common.postman_collection.json`
2. Set up environment variables in Postman
3. Run the test requests

### Option C: Run Automated Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test
npm test meeting-actions
```

## Step 5: Explore the Agents

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/meeting-actions` | POST | Extract action items from meeting transcripts |
| `/api/invoice-anomalies` | GET | Detect suspicious invoices |
| `/api/support-brief` | POST | Generate support ticket summaries |
| `/api/seo-pages` | GET | Parse sitemap for SEO analysis |

### Sample Data Locations

All sample data is located in `data/agents-seed-pack-full/`:

```
data/agents-seed-pack-full/
├── day01_Smart_Payment_Follow-Up/
│   ├── invoices.csv
│   ├── contacts.csv
│   └── policy.yaml
├── day08_Meeting_Action_Enforcer/
│   ├── transcript.txt
│   └── actions_expected.json
├── day21_Support_Summarizer_and_Router/
│   ├── zendesk_tickets.json
│   └── router_policy.yaml
└── day25_Invoice_Fraud_Anomaly_Detector/
    ├── invoices.csv
    └── vendors.csv
```

## Step 6: Build Your First Agent

Let's create a simple "Hello Agent" to understand the pattern:

### 1. Create API Route

Create `app/api/hello-agent/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define input schema
const HelloInput = z.object({
  name: z.string().optional().default("World"),
  language: z.enum(["en", "es", "fr"]).optional().default("en")
});

// Define output schema
const HelloOutput = z.object({
  message: z.string(),
  timestamp: z.string(),
  language: z.string()
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate input
    const body = await req.json().catch(() => ({}));
    const input = HelloInput.parse(body);
    
    // Business logic
    const greetings = {
      en: `Hello, ${input.name}!`,
      es: `¡Hola, ${input.name}!`,
      fr: `Bonjour, ${input.name}!`
    };
    
    const result = {
      message: greetings[input.language],
      timestamp: new Date().toISOString(),
      language: input.language
    };
    
    // Validate output
    const output = HelloOutput.parse(result);
    
    return NextResponse.json(output);
  } catch (error) {
    console.error("Hello Agent Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 400 }
    );
  }
}
```

### 2. Create Test

Create `tests/hello-agent.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

describe("Hello Agent", () => {
  it("returns greeting in English by default", async () => {
    const res = await fetch("http://localhost:3000/api/hello-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Developer" })
    });
    
    const data = await res.json();
    expect(data.message).toBe("Hello, Developer!");
    expect(data.language).toBe("en");
  });
  
  it("returns greeting in Spanish", async () => {
    const res = await fetch("http://localhost:3000/api/hello-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Desarrollador", language: "es" })
    });
    
    const data = await res.json();
    expect(data.message).toBe("¡Hola, Desarrollador!");
    expect(data.language).toBe("es");
  });
});
```

### 3. Test Your Agent

```bash
# Test with cURL
curl -X POST http://localhost:3000/api/hello-agent \
  -H "Content-Type: application/json" \
  -d '{"name": "Developer", "language": "en"}'

# Run the test
npm test hello-agent
```

## Common Issues & Solutions

### Issue: "Module not found" errors
**Solution**: Ensure you're in the correct directory and dependencies are installed:
```bash
pwd  # Should show the project root
npm install
```

### Issue: API endpoints return 404
**Solution**: Ensure the development server is running:
```bash
npm run dev
```

### Issue: Tests fail with connection errors
**Solution**: Make sure the dev server is running before running tests:
```bash
# Terminal 1
npm run dev

# Terminal 2 (after server starts)
npm test
```

### Issue: Environment variables not working
**Solution**: Check your `.env.local` file:
- File should be in the project root
- No spaces around the `=` sign
- Restart the dev server after changes

## Next Steps

1. **Explore Existing Agents**: Check out the 30 pre-built agents in the catalog
2. **Read the Architecture Guide**: Understand the system design
3. **Configure External APIs**: Set up integrations for enhanced functionality
4. **Deploy Your First Agent**: Follow the deployment guide
5. **Join the Community**: Contribute to the project and share your agents

## Getting Help

- 📖 **Documentation**: Check the [docs/](../docs/) folder
- 🐛 **Issues**: Report bugs on [GitHub Issues](https://github.com/indranilbanerjee/hackathon-agents-starter/issues)
- 💬 **Discussions**: Join conversations on [GitHub Discussions](https://github.com/indranilbanerjee/hackathon-agents-starter/discussions)
- 📧 **Email**: Contact the maintainers

## Useful Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

You're now ready to build amazing business automation agents! 🚀
