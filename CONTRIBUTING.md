# 🤝 Contributing to 30 Agents Starter

Thank you for your interest in contributing to the 30 Agents Starter Repository! This guide will help you get started with contributing to this open-source project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Code Style Guide](#code-style-guide)
- [Testing Requirements](#testing-requirements)
- [Documentation Standards](#documentation-standards)

## Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to help us maintain a welcoming and inclusive community.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of TypeScript/JavaScript
- Familiarity with Next.js and React
- Understanding of AI/LLM concepts (helpful but not required)

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/hackathon-agents-starter.git
   cd hackathon-agents-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp data/agents-seed-pack-full/.env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

#### 🐛 Bug Fixes
- Fix existing functionality that isn't working as expected
- Improve error handling and edge cases
- Performance optimizations

#### ✨ New Features
- New agent implementations
- Enhanced existing agents
- New integrations with external services
- Developer experience improvements

#### 📚 Documentation
- Improve existing documentation
- Add new guides and tutorials
- Fix typos and clarify instructions
- Add code examples

#### 🧪 Testing
- Add missing test coverage
- Improve test quality and reliability
- Add integration and e2e tests

### What We're Looking For

**High Priority:**
- Additional agent implementations (we have 30, but there's room for more!)
- Improved error handling and resilience
- Better test coverage
- Performance optimizations
- Security improvements

**Medium Priority:**
- UI/UX improvements for the demo interface
- Additional external service integrations
- Better monitoring and observability
- Documentation improvements

**Low Priority:**
- Code style improvements
- Refactoring (unless it significantly improves maintainability)

## Pull Request Process

### Before You Start

1. **Check existing issues** to see if your idea is already being worked on
2. **Create an issue** to discuss major changes before implementing
3. **Fork the repository** and create a feature branch

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Follow our [code style guide](#code-style-guide)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm test
   npm run type-check
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add customer sentiment analysis agent"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use our PR template
   - Provide clear description of changes
   - Link related issues
   - Add screenshots for UI changes

### Pull Request Requirements

✅ **Required for all PRs:**
- [ ] Tests pass (`npm test`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Clear, descriptive commit messages
- [ ] PR description explains the changes

✅ **Required for new features:**
- [ ] Tests added for new functionality
- [ ] Documentation updated
- [ ] Example usage provided

✅ **Required for new agents:**
- [ ] Agent follows established patterns
- [ ] Input/output schemas defined with Zod
- [ ] Error handling implemented
- [ ] Tests cover main functionality
- [ ] Documentation added to `docs/agents/`

## Issue Guidelines

### Reporting Bugs

When reporting bugs, please include:

```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- OS: [e.g. macOS, Windows, Linux]
- Node.js version: [e.g. 18.17.0]
- npm version: [e.g. 9.6.7]
- Browser: [e.g. Chrome 118]

**Additional Context**
Add any other context about the problem here.
```

### Requesting Features

For feature requests, please include:

```markdown
**Feature Description**
A clear description of what you want to happen.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How would you like this to work?

**Alternatives Considered**
What other solutions did you consider?

**Additional Context**
Add any other context or screenshots about the feature request here.
```

## Code Style Guide

### TypeScript/JavaScript

We use ESLint and Prettier for code formatting. Key guidelines:

```typescript
// ✅ Good: Use descriptive names
const calculateChurnProbability = (customer: CustomerData) => {
  // Implementation
};

// ❌ Bad: Unclear names
const calc = (c: any) => {
  // Implementation
};

// ✅ Good: Use proper typing
interface AgentResponse {
  success: boolean;
  data: any;
  error?: string;
}

// ❌ Bad: Avoid 'any' when possible
const processData = (input: any): any => {
  // Implementation
};

// ✅ Good: Use Zod for validation
const InputSchema = z.object({
  customerId: z.string(),
  includeHistory: z.boolean().default(false)
});

// ✅ Good: Handle errors properly
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error('Operation failed', { error });
  throw new AgentError('Processing failed', 'PROCESSING_ERROR');
}
```

### File Organization

```
app/api/agent-name/
├── route.ts              # API endpoint
└── README.md             # Agent-specific docs

lib/
├── agents/
│   └── agent-name.ts     # Business logic
├── schemas/
│   └── agent-name.ts     # Zod schemas
└── utils/
    └── agent-helpers.ts  # Shared utilities

tests/
├── unit/
│   └── agent-name.test.ts
└── integration/
    └── agent-name.api.test.ts
```

### Naming Conventions

- **Files**: kebab-case (`customer-churn.ts`)
- **Functions**: camelCase (`calculateRisk`)
- **Classes**: PascalCase (`CustomerAnalyzer`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Types/Interfaces**: PascalCase (`CustomerData`)

## Testing Requirements

### Test Coverage

- **Unit tests**: All business logic functions
- **Integration tests**: API endpoints
- **Schema tests**: Input/output validation

### Test Structure

```typescript
// tests/unit/customer-churn.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { calculateChurnRisk } from '@/lib/agents/customer-churn';

describe('Customer Churn Agent', () => {
  describe('calculateChurnRisk', () => {
    it('should identify high-risk customers', async () => {
      // Arrange
      const highRiskCustomer = createMockCustomer({
        lastLogin: '2025-08-01',
        supportTickets: 10
      });
      
      // Act
      const result = await calculateChurnRisk(highRiskCustomer);
      
      // Assert
      expect(result.riskLevel).toBe('high');
      expect(result.probability).toBeGreaterThan(0.7);
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test customer-churn

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Documentation Standards

### Code Documentation

```typescript
/**
 * Analyzes customer data to predict churn probability
 * 
 * @param customer - Customer data including usage metrics and account info
 * @param options - Analysis options (historical data, model settings)
 * @returns Churn prediction with probability, risk level, and recommendations
 * 
 * @example
 * ```typescript
 * const prediction = await predictChurn(customerData, {
 *   includeHistorical: true,
 *   modelVersion: 'v2'
 * });
 * console.log(prediction.riskLevel); // 'high'
 * ```
 */
export async function predictChurn(
  customer: CustomerData,
  options: AnalysisOptions = {}
): Promise<ChurnPrediction> {
  // Implementation
}
```

### README Updates

When adding new agents, update the main README.md:

```markdown
| Day X | Agent Name | Description | Use Case |
|-------|------------|-------------|----------|
| 31 | Customer Sentiment Analyzer | Analyzes customer feedback sentiment | Customer Success |
```

### Agent Documentation

Create detailed documentation in `docs/agents/`:

```markdown
# Customer Sentiment Analyzer

## Overview
Analyzes customer feedback from multiple channels to determine sentiment and identify issues.

## How It Works
[Detailed explanation with diagrams]

## Configuration
[Environment variables and setup]

## API Usage
[Request/response examples]

## Real-World Enhancements
[Suggestions for production use]
```

## Review Process

### What We Look For

**Code Quality:**
- Follows TypeScript best practices
- Proper error handling
- Clear, readable code
- Appropriate test coverage

**Functionality:**
- Solves a real business problem
- Works as described
- Handles edge cases
- Performs well

**Documentation:**
- Clear explanations
- Code examples
- Setup instructions
- API documentation

### Review Timeline

- **Small fixes**: 1-2 days
- **New features**: 3-7 days
- **Major changes**: 1-2 weeks

We'll provide feedback and work with you to get your contribution merged!

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/indranilbanerjee/hackathon-agents-starter/discussions)
- **Bugs**: Create an [Issue](https://github.com/indranilbanerjee/hackathon-agents-starter/issues)
- **Chat**: Join our community Discord (link in README)

## Recognition

Contributors will be:
- Added to our contributors list
- Mentioned in release notes
- Invited to our contributors Discord channel

Thank you for contributing to making business automation more accessible! 🚀
