# 🧪 Testing Guide

Comprehensive testing strategies for the 30 Agents Starter Repository.

## Testing Philosophy

Our testing approach follows the testing pyramid:
- **Unit Tests (70%)**: Test individual functions and components
- **Integration Tests (20%)**: Test API endpoints and agent workflows
- **End-to-End Tests (10%)**: Test complete user journeys

## Test Setup

### Prerequisites
```bash
# Install test dependencies (already included)
npm install

# Verify test setup
npm test -- --version
```

### Test Configuration
The project uses **Vitest** for fast, modern testing:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  }
});
```

### Test Environment Setup
```typescript
// tests/setup.ts
import { beforeAll, afterAll, beforeEach } from 'vitest';
import { setupTestDatabase, cleanupTestDatabase } from './helpers/database';
import { startTestServer, stopTestServer } from './helpers/server';

beforeAll(async () => {
  await setupTestDatabase();
  await startTestServer();
});

afterAll(async () => {
  await stopTestServer();
  await cleanupTestDatabase();
});

beforeEach(async () => {
  // Reset test data before each test
  await resetTestData();
});
```

## Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test meeting-actions

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Filtering
```bash
# Run only unit tests
npm test -- --grep "unit"

# Run only integration tests
npm test -- --grep "integration"

# Run tests for specific agent
npm test -- --grep "meeting-actions"

# Skip slow tests
npm test -- --grep "slow" --invert
```

## Unit Testing

### Testing Utility Functions
```typescript
// tests/unit/utils.test.ts
import { describe, it, expect } from 'vitest';
import { calculateDaysPastDue, formatCurrency } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('calculateDaysPastDue', () => {
    it('should calculate days past due correctly', () => {
      const dueDate = '2025-10-01';
      const currentDate = '2025-10-05';
      
      const result = calculateDaysPastDue(dueDate, currentDate);
      
      expect(result).toBe(4);
    });

    it('should return 0 for future due dates', () => {
      const dueDate = '2025-12-01';
      const currentDate = '2025-10-01';
      
      const result = calculateDaysPastDue(dueDate, currentDate);
      
      expect(result).toBe(0);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      const result = formatCurrency(1234.56, 'USD', 'en-US');
      expect(result).toBe('$1,234.56');
    });

    it('should format EUR currency correctly', () => {
      const result = formatCurrency(1234.56, 'EUR', 'de-DE');
      expect(result).toBe('1.234,56 €');
    });
  });
});
```

### Testing Schema Validation
```typescript
// tests/unit/schemas.test.ts
import { describe, it, expect } from 'vitest';
import { ActionItem, ActionItems } from '@/lib/schemas';

describe('Schema Validation', () => {
  describe('ActionItem', () => {
    it('should validate correct action item', () => {
      const validItem = {
        owner: 'John Doe',
        title: 'Prepare report',
        due: '2025-10-20'
      };

      const result = ActionItem.safeParse(validItem);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validItem);
    });

    it('should reject invalid due date format', () => {
      const invalidItem = {
        owner: 'John Doe',
        title: 'Prepare report',
        due: '10/20/2025' // Wrong format
      };

      const result = ActionItem.safeParse(invalidItem);
      
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toEqual(['due']);
    });
  });
});
```

### Testing Business Logic
```typescript
// tests/unit/fraud-detection.test.ts
import { describe, it, expect, vi } from 'vitest';
import { analyzeFraudRisk } from '@/lib/fraud-detector';

describe('Fraud Detection', () => {
  it('should detect round amount anomaly', async () => {
    const invoice = {
      id: 'I-1',
      vendor: 'Test Vendor',
      amount: 10000.00, // Suspiciously round
      date: '2025-10-14'
    };

    const result = await analyzeFraudRisk(invoice, {});
    
    expect(result.anomalies).toContainEqual(
      expect.objectContaining({
        type: 'round_amount',
        severity: 'medium'
      })
    );
  });

  it('should detect amount outlier', async () => {
    const invoice = {
      id: 'I-2',
      vendor: 'Regular Vendor',
      amount: 50000.00, // Much higher than usual
      date: '2025-10-14'
    };

    const historicalData = [
      { vendor: 'Regular Vendor', amount: 1000 },
      { vendor: 'Regular Vendor', amount: 1200 },
      { vendor: 'Regular Vendor', amount: 900 }
    ];

    const result = await analyzeFraudRisk(invoice, { historical_data: historicalData });
    
    expect(result.score).toBeGreaterThan(0.5);
    expect(result.level).toBe('high');
  });
});
```

## Integration Testing

### Testing API Endpoints
```typescript
// tests/integration/meeting-actions.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { startTestServer, stopTestServer } from '../helpers/server';

describe('Meeting Actions API', () => {
  beforeAll(async () => {
    await startTestServer();
  });

  afterAll(async () => {
    await stopTestServer();
  });

  it('should extract action items from transcript', async () => {
    const transcript = `
      Meeting: Q4 Strategy
      Actions:
      - @John prepare pricing sheet by Oct 20
      - @Jane update pitch deck by Oct 18
    `;

    const response = await fetch('http://localhost:3001/api/meeting-actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript })
    });

    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(2);
    
    expect(data[0]).toMatchObject({
      owner: 'John',
      title: expect.stringContaining('pricing sheet'),
      due: '2025-10-20'
    });
  });

  it('should handle empty transcript', async () => {
    const response = await fetch('http://localhost:3001/api/meeting-actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: '' })
    });

    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(0);
  });

  it('should validate input schema', async () => {
    const response = await fetch('http://localhost:3001/api/meeting-actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invalid: 'data' })
    });

    expect(response.status).toBe(400);
    
    const error = await response.json();
    expect(error.error).toBeDefined();
  });
});
```

### Testing Database Operations
```typescript
// tests/integration/database.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { saveActionItems, getActionItems } from '@/lib/database';

describe('Database Operations', () => {
  beforeEach(async () => {
    // Clean test database
    await cleanTestDatabase();
  });

  it('should save and retrieve action items', async () => {
    const actionItems = [
      {
        owner: 'John',
        title: 'Test task',
        due: '2025-10-20',
        meeting_id: 'test-meeting'
      }
    ];

    await saveActionItems(actionItems);
    
    const retrieved = await getActionItems('test-meeting');
    
    expect(retrieved).toHaveLength(1);
    expect(retrieved[0]).toMatchObject(actionItems[0]);
  });

  it('should handle duplicate action items', async () => {
    const actionItem = {
      owner: 'John',
      title: 'Test task',
      due: '2025-10-20',
      meeting_id: 'test-meeting'
    };

    await saveActionItems([actionItem]);
    await saveActionItems([actionItem]); // Duplicate

    const retrieved = await getActionItems('test-meeting');
    
    // Should not create duplicates
    expect(retrieved).toHaveLength(1);
  });
});
```

## Mocking External Services

### Mocking OpenRouter API
```typescript
// tests/mocks/openrouter.ts
import { vi } from 'vitest';

export const mockOpenRouter = {
  chat: {
    completions: {
      create: vi.fn().mockResolvedValue({
        choices: [{
          message: {
            content: JSON.stringify([
              {
                assignee: 'John',
                task: 'Prepare report',
                deadline: '2025-10-20',
                priority: 'high'
              }
            ])
          }
        }]
      })
    }
  }
};

// Mock the module
vi.mock('openai', () => ({
  OpenAI: vi.fn(() => mockOpenRouter)
}));
```

### Mocking Database
```typescript
// tests/mocks/database.ts
import { vi } from 'vitest';

const mockDatabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        data: [],
        error: null
      }))
    })),
    insert: vi.fn(() => ({
      data: null,
      error: null
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        data: null,
        error: null
      }))
    }))
  }))
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockDatabase)
}));
```

## Test Data Management

### Test Fixtures
```typescript
// tests/fixtures/invoices.ts
export const mockInvoices = [
  {
    id: 'inv-1',
    vendor: 'Test Vendor',
    amount: 1000.00,
    date: '2025-10-01',
    status: 'open'
  },
  {
    id: 'inv-2',
    vendor: 'Suspicious Vendor',
    amount: 25000.00, // Anomalous amount
    date: '2025-10-02',
    status: 'open'
  }
];

export const mockVendors = [
  {
    id: 'vendor-1',
    name: 'Test Vendor',
    created_at: '2024-01-01',
    bank_account: '123456789'
  }
];
```

### Dynamic Test Data
```typescript
// tests/helpers/factories.ts
import { faker } from '@faker-js/faker';

export function createMockInvoice(overrides = {}) {
  return {
    id: faker.string.uuid(),
    vendor: faker.company.name(),
    amount: faker.number.float({ min: 100, max: 10000, precision: 0.01 }),
    date: faker.date.recent().toISOString().split('T')[0],
    status: faker.helpers.arrayElement(['open', 'paid', 'overdue']),
    ...overrides
  };
}

export function createMockActionItem(overrides = {}) {
  return {
    owner: faker.person.fullName(),
    title: faker.lorem.sentence(),
    due: faker.date.future().toISOString().split('T')[0],
    priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
    ...overrides
  };
}
```

## Performance Testing

### Load Testing
```typescript
// tests/performance/load.test.ts
import { describe, it, expect } from 'vitest';
import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  it('should handle multiple concurrent requests', async () => {
    const concurrentRequests = 10;
    const requests = Array(concurrentRequests).fill(null).map(() =>
      fetch('http://localhost:3001/api/meeting-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: 'Test meeting' })
      })
    );

    const start = performance.now();
    const responses = await Promise.all(requests);
    const duration = performance.now() - start;

    // All requests should succeed
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });

    // Should complete within reasonable time
    expect(duration).toBeLessThan(5000); // 5 seconds
  });

  it('should process large datasets efficiently', async () => {
    const largeDataset = Array(1000).fill(null).map((_, i) => ({
      id: `item-${i}`,
      data: `test data ${i}`
    }));

    const start = performance.now();
    const result = await processLargeDataset(largeDataset);
    const duration = performance.now() - start;

    expect(result).toBeDefined();
    expect(duration).toBeLessThan(2000); // 2 seconds
  });
});
```

## Test Helpers

### Server Helpers
```typescript
// tests/helpers/server.ts
import { spawn } from 'child_process';
import { waitForPort } from './utils';

let serverProcess: any;

export async function startTestServer() {
  serverProcess = spawn('npm', ['run', 'dev'], {
    env: { ...process.env, PORT: '3001' },
    stdio: 'pipe'
  });

  await waitForPort(3001, 30000);
}

export async function stopTestServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}
```

### Database Helpers
```typescript
// tests/helpers/database.ts
import { createClient } from '@supabase/supabase-js';

const testDb = createClient(
  process.env.TEST_SUPABASE_URL!,
  process.env.TEST_SUPABASE_KEY!
);

export async function setupTestDatabase() {
  // Create test tables if they don't exist
  await testDb.rpc('setup_test_schema');
}

export async function cleanupTestDatabase() {
  // Drop test tables
  await testDb.rpc('cleanup_test_schema');
}

export async function resetTestData() {
  // Clear all test data
  await testDb.from('action_items').delete().neq('id', '');
  await testDb.from('agent_runs').delete().neq('id', '');
}
```

## Continuous Integration

### GitHub Actions Test Workflow
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm run test:ci
        env:
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
          TEST_SUPABASE_URL: ${{ secrets.TEST_SUPABASE_URL }}
          TEST_SUPABASE_KEY: ${{ secrets.TEST_SUPABASE_KEY }}
      
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## Best Practices

### Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent and isolated

### Test Data
- Use factories for generating test data
- Clean up after each test
- Use realistic but safe test data
- Avoid hardcoded values

### Mocking Strategy
- Mock external dependencies
- Use real implementations for internal code
- Mock at the boundary of your system
- Verify mock interactions when necessary

### Performance
- Run fast tests frequently
- Run slow tests in CI
- Use parallel test execution
- Profile and optimize slow tests

This testing guide ensures your agents are reliable, maintainable, and production-ready.
