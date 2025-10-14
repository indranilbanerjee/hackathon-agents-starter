# 🔍 Troubleshooting Guide

Common issues and solutions for the 30 Agents Starter Repository.

## Quick Diagnostics

### Health Check Commands
```bash
# Check if development server is running
curl http://localhost:3000/api/health

# Verify environment variables
node -e "console.log(process.env.OPENROUTER_API_KEY ? 'API key set' : 'API key missing')"

# Test database connection
npm run db:test

# Check dependencies
npm ls --depth=0
```

## Installation Issues

### Node.js Version Conflicts
**Problem**: Build fails with Node.js version errors
```
Error: The engine "node" is incompatible with this module
```

**Solution**:
```bash
# Check current Node.js version
node --version

# Install correct version (18+)
nvm install 18
nvm use 18

# Or using n
npm install -g n
n 18

# Verify version
node --version  # Should show v18.x.x
```

### Package Installation Failures
**Problem**: `npm install` fails with permission or network errors

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install

# Use different registry if network issues
npm install --registry https://registry.npmjs.org/

# Fix permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
```

### TypeScript Compilation Errors
**Problem**: Build fails with TypeScript errors

**Solution**:
```bash
# Check TypeScript version
npx tsc --version

# Run type checking
npm run type-check

# Fix common issues
# 1. Update @types packages
npm update @types/node @types/react

# 2. Clear TypeScript cache
rm -rf .next/cache
```

## Environment Configuration Issues

### API Keys Not Working
**Problem**: API calls fail with authentication errors

**Diagnosis**:
```bash
# Check if .env.local exists
ls -la .env.local

# Verify environment variables are loaded
node -e "
require('dotenv').config({ path: '.env.local' });
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'Set' : 'Missing');
console.log('HELICONE_API_KEY:', process.env.HELICONE_API_KEY ? 'Set' : 'Missing');
"

# Test API key validity
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
     https://openrouter.ai/api/v1/models
```

**Solutions**:
```bash
# 1. Copy environment template
cp data/agents-seed-pack-full/.env.example .env.local

# 2. Verify no extra spaces or quotes
# Wrong: OPENROUTER_API_KEY = "sk-or-v1-xxxxx"
# Right: OPENROUTER_API_KEY=sk-or-v1-xxxxx

# 3. Restart development server after changes
npm run dev
```

### Database Connection Issues
**Problem**: Supabase connection fails

**Diagnosis**:
```typescript
// Test connection
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Test query
const { data, error } = await supabase.from('test').select('*').limit(1);
console.log('Connection test:', error ? 'Failed' : 'Success');
```

**Solutions**:
```bash
# 1. Verify Supabase URLs and keys
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# 2. Check Supabase project status
# Visit https://app.supabase.com/projects

# 3. Test with curl
curl -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
     "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/"
```

## Runtime Issues

### API Endpoints Returning 404
**Problem**: API routes not found

**Diagnosis**:
```bash
# Check if API routes exist
ls -la app/api/

# Verify route structure
find app/api -name "route.ts" -o -name "route.js"

# Check development server logs
npm run dev  # Look for route registration messages
```

**Solutions**:
```bash
# 1. Ensure correct file structure
# ✓ app/api/meeting-actions/route.ts
# ✗ app/api/meeting-actions.ts

# 2. Verify export syntax
# In route.ts:
export async function GET() { /* ... */ }
export async function POST() { /* ... */ }

# 3. Restart development server
npm run dev
```

### Memory Issues
**Problem**: Application runs out of memory

**Diagnosis**:
```bash
# Monitor memory usage
node --max-old-space-size=4096 npm run dev

# Check for memory leaks
node --inspect npm run dev
# Open chrome://inspect in Chrome
```

**Solutions**:
```bash
# 1. Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# 2. Optimize large data processing
# Process data in chunks instead of loading everything
const processInChunks = async (data, chunkSize = 100) => {
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    await processChunk(chunk);
  }
};

# 3. Clear caches regularly
rm -rf .next/cache
```

## Agent-Specific Issues

### Meeting Action Enforcer
**Problem**: No action items extracted from transcript

**Diagnosis**:
```typescript
// Test with simple transcript
const testTranscript = `
Meeting: Test
Actions:
- @John prepare report by Friday
- @Jane review document by Monday
`;

const response = await fetch('/api/meeting-actions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ transcript: testTranscript })
});

console.log(await response.json());
```

**Solutions**:
1. **Check transcript format**: Ensure clear action item patterns
2. **Verify AI model access**: Test OpenRouter API key
3. **Adjust parsing logic**: Modify regex patterns in route handler

### Invoice Anomaly Detector
**Problem**: No anomalies detected in obviously suspicious data

**Diagnosis**:
```bash
# Check sample data
head -5 data/agents-seed-pack-full/day25_Invoice_Fraud_Anomaly_Detector/invoices.csv

# Test with known anomalous invoice
curl http://localhost:3000/api/invoice-anomalies
```

**Solutions**:
1. **Adjust thresholds**: Lower anomaly detection sensitivity
2. **Verify data format**: Ensure CSV parsing is correct
3. **Check algorithm logic**: Review anomaly detection rules

### Support Brief Generator
**Problem**: Generated briefs are incomplete or incorrect

**Common Issues**:
```typescript
// 1. Missing required fields
const requiredFields = ['issue', 'env', 'steps_tried', 'severity', 'next_action'];

// 2. Invalid severity levels
const validSeverities = ['low', 'medium', 'high', 'critical'];

// 3. Schema validation failures
import { TicketBrief } from '@/lib/schemas';
const result = TicketBrief.safeParse(briefData);
if (!result.success) {
  console.error('Validation errors:', result.error);
}
```

## Performance Issues

### Slow API Response Times
**Problem**: API endpoints taking >5 seconds to respond

**Diagnosis**:
```typescript
// Add timing middleware
export async function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();
  const duration = Date.now() - start;
  
  response.headers.set('X-Response-Time', `${duration}ms`);
  return response;
}
```

**Solutions**:
```typescript
// 1. Implement caching
import { cache } from '@/lib/cache';

export async function GET() {
  const cacheKey = 'expensive-operation';
  let result = await cache.get(cacheKey);
  
  if (!result) {
    result = await expensiveOperation();
    await cache.set(cacheKey, result, 300); // 5 minutes
  }
  
  return Response.json(result);
}

// 2. Optimize database queries
// Use indexes, limit results, avoid N+1 queries

// 3. Implement request timeouts
const controller = new AbortController();
setTimeout(() => controller.abort(), 10000); // 10 second timeout

const response = await fetch(url, {
  signal: controller.signal
});
```

### High Memory Usage
**Problem**: Application consuming excessive memory

**Solutions**:
```typescript
// 1. Stream large responses
import { Readable } from 'stream';

export async function GET() {
  const stream = new Readable({
    read() {
      // Generate data in chunks
      this.push(getNextChunk());
    }
  });
  
  return new Response(stream);
}

// 2. Implement garbage collection hints
if (global.gc) {
  global.gc();
}

// 3. Use WeakMap for caching
const cache = new WeakMap();
```

## External API Issues

### OpenRouter API Failures
**Problem**: LLM requests failing or timing out

**Diagnosis**:
```bash
# Test API directly
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "test"}]}' \
     https://openrouter.ai/api/v1/chat/completions
```

**Solutions**:
```typescript
// 1. Implement retry logic
async function callLLMWithRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callLLM(prompt);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// 2. Add timeout handling
const controller = new AbortController();
setTimeout(() => controller.abort(), 30000);

const response = await fetch(url, {
  signal: controller.signal,
  headers: { 'Authorization': `Bearer ${apiKey}` }
});

// 3. Implement fallback models
const models = ['gpt-4', 'gpt-3.5-turbo', 'claude-3-sonnet'];
for (const model of models) {
  try {
    return await callLLM(prompt, model);
  } catch (error) {
    console.warn(`Model ${model} failed, trying next...`);
  }
}
```

### Rate Limiting Issues
**Problem**: External APIs returning 429 (Too Many Requests)

**Solutions**:
```typescript
// 1. Implement exponential backoff
async function withBackoff(fn: () => Promise<any>, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

// 2. Implement request queuing
import PQueue from 'p-queue';

const queue = new PQueue({
  concurrency: 5,
  interval: 1000,
  intervalCap: 10
});

export async function queuedRequest(fn: () => Promise<any>) {
  return queue.add(fn);
}
```

## Testing Issues

### Tests Failing in CI/CD
**Problem**: Tests pass locally but fail in CI

**Common Causes**:
```bash
# 1. Environment differences
# Ensure CI has same Node.js version
node --version

# 2. Missing environment variables
# Check CI environment variables are set

# 3. Timing issues
# Add delays for async operations
await new Promise(resolve => setTimeout(resolve, 1000));

# 4. Port conflicts
# Use dynamic ports in tests
const port = process.env.PORT || 3001;
```

### Mock Data Issues
**Problem**: Tests failing due to missing or invalid mock data

**Solutions**:
```typescript
// 1. Create test fixtures
// tests/fixtures/meeting-transcript.ts
export const mockTranscript = `
Meeting: Q4 Strategy
Actions:
- @John prepare report by Friday
- @Jane review document by Monday
`;

// 2. Use test database
if (process.env.NODE_ENV === 'test') {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

// 3. Mock external APIs
jest.mock('@/lib/openrouter', () => ({
  callLLM: jest.fn().mockResolvedValue('mocked response')
}));
```

## Debugging Tools

### Enable Debug Logging
```bash
# Enable debug mode
DEBUG=* npm run dev

# Specific debug categories
DEBUG=agents:* npm run dev
DEBUG=api:* npm run dev
```

### Browser DevTools
```typescript
// Add debugging breakpoints
debugger;

// Console logging with context
console.log('Processing invoice:', {
  id: invoice.id,
  amount: invoice.amount,
  timestamp: new Date().toISOString()
});

// Performance monitoring
console.time('expensive-operation');
await expensiveOperation();
console.timeEnd('expensive-operation');
```

### Network Debugging
```bash
# Monitor network requests
curl -v http://localhost:3000/api/meeting-actions

# Check request/response headers
curl -I http://localhost:3000/api/health

# Test with different HTTP methods
curl -X POST -H "Content-Type: application/json" \
     -d '{"test": "data"}' \
     http://localhost:3000/api/endpoint
```

## Getting Help

### Before Asking for Help
1. Check this troubleshooting guide
2. Search existing GitHub issues
3. Review the documentation
4. Test with minimal reproduction case

### Creating Bug Reports
Include:
- Node.js version (`node --version`)
- npm version (`npm --version`)
- Operating system
- Error messages (full stack trace)
- Steps to reproduce
- Expected vs actual behavior

### Community Resources
- [GitHub Issues](https://github.com/indranilbanerjee/hackathon-agents-starter/issues)
- [GitHub Discussions](https://github.com/indranilbanerjee/hackathon-agents-starter/discussions)
- [Documentation](../docs/)

Remember: Most issues are configuration-related. Double-check environment variables, API keys, and file paths before diving deeper into debugging.
