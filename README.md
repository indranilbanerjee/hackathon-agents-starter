# 🤖 30 Agents — Complete Starter Repository

[![CI](https://github.com/indranilbanerjee/hackathon-agents-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/indranilbanerjee/hackathon-agents-starter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **production-ready scaffold** for building 30 intelligent business automation agents. This repository provides a complete foundation for creating AI-powered agents that solve real-world business problems across finance, operations, marketing, HR, and more.

**🌐 NEW: GitHub Data Access** - Team members can now access demo data directly from GitHub without local setup!

## 🚀 What's Inside

- **30 Pre-built Agent Templates** - Complete with sample data and configurations
- **🌐 GitHub Data Access** - Direct access to demo data without local setup
- **Next.js API Framework** - Production-ready endpoints with TypeScript
- **Comprehensive Test Suite** - Vitest + GitHub Actions CI/CD
- **Real-world Data Sets** - Realistic CSV, JSON, and configuration files
- **Schema Validation** - Zod-powered data validation
- **Multi-platform Integration** - Support for 20+ external APIs
- **Documentation & Examples** - Detailed guides and implementation patterns

## 📋 Quick Start

### 🌐 **Option 1: GitHub Data Access (No Local Setup)**
```bash
# Access any agent's demo data directly from GitHub
curl http://localhost:3000/api/github/invoice-anomalies

# Get specific data files
curl http://localhost:3000/api/github/invoice-anomalies/invoices.csv

# Direct GitHub raw URLs (work anywhere)
curl https://raw.githubusercontent.com/indranilbanerjee/hackathon-agents-starter/main/data/agents-seed-pack-full/day25_Invoice_Fraud_Anomaly_Detector/invoices.csv
```

### 💻 **Option 2: Full Local Development**
```bash
# Clone the repository
git clone https://github.com/indranilbanerjee/hackathon-agents-starter.git
cd hackathon-agents-starter

# Install dependencies
npm install

# Set up environment variables
cp data/agents-seed-pack-full/.env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev

# Run tests
npm test
```

## 🏗️ Architecture Overview

This repository follows a modular architecture designed for scalability and maintainability:

```
├── app/api/              # Next.js API routes for agent endpoints
│   ├── agents/           # Agent registry and data access APIs
│   └── github/           # GitHub data access endpoints
├── data/                 # Seed data and configurations for all agents
├── lib/                  # Shared schemas and utilities
│   ├── agent-registry.ts # Central agent configuration
│   ├── data-access.ts    # Local + GitHub data access
│   └── github-data-access.ts # Direct GitHub integration
├── tests/                # Comprehensive test suite
├── docs/                 # Detailed documentation
└── postman/              # API collection for testing
```

## 🎯 Agent Catalog

### 💰 Finance & Accounting (Days 1-7)
| Agent | Description | Real-world Impact |
|-------|-------------|-------------------|
| [Smart Payment Follow-Up](docs/agents/day01-smart-payment-follow-up.md) | Automated invoice reminders with multi-channel escalation | Reduces DSO by 25-40% |
| [Expense Parser & Categorizer](docs/agents/day02-expense-parser.md) | OCR + AI categorization of receipts and expenses | Saves 15+ hours/week for finance teams |
| [Contract Clause Compliance](docs/agents/day03-contract-compliance.md) | Scans contracts for compliance violations | Prevents 90% of contract disputes |
| [Customer Sentiment Tracker](docs/agents/day04-sentiment-tracker.md) | Monitors customer communications for sentiment shifts | Early warning system for churn |
| [Client Sentiment CommsIQ](docs/agents/day05-comms-iq.md) | Advanced email thread sentiment analysis | Improves client retention by 30% |
| [Vendor SLA Watchdog](docs/agents/day06-sla-watchdog.md) | Monitors vendor performance against SLAs | Reduces vendor disputes by 60% |
| [PO-GRN-Invoice Reconciler](docs/agents/day07-po-reconciler.md) | Three-way matching automation | Eliminates 95% of manual reconciliation |

### 🤝 Sales & Marketing (Days 8-15)
| Agent | Description | Real-world Impact |
|-------|-------------|-------------------|
| [Meeting Action Enforcer](docs/agents/day08-meeting-actions.md) | Extracts and tracks action items from meetings | Increases follow-through by 80% |
| [Pipeline Nurture Agent](docs/agents/day09-pipeline-nurture.md) | Automated lead nurturing based on deal stage | Improves conversion rates by 35% |
| [Lead Enrichment & ICP Scorer](docs/agents/day10-lead-enrichment.md) | Scores leads against Ideal Customer Profile | Increases qualified leads by 50% |
| [Proposal Scope Guard](docs/agents/day11-proposal-scope.md) | Prevents scope creep in proposals | Reduces project overruns by 40% |
| [Changelog to Success Notes](docs/agents/day12-changelog-success.md) | Converts product updates to customer success stories | Improves feature adoption by 60% |
| [SEO Issue Sentinel](docs/agents/day13-seo-sentinel.md) | Monitors and alerts on SEO issues | Prevents 90% of ranking drops |
| [Landing Page Uptime & Copy Fixer](docs/agents/day14-landing-page.md) | Monitors page performance and suggests improvements | Increases conversion rates by 25% |
| [Social Listening Crisis Alerts](docs/agents/day15-social-listening.md) | Early warning system for brand crises | Reduces crisis response time by 75% |

### 👥 HR & Operations (Days 16-23)
| Agent | Description | Real-world Impact |
|-------|-------------|-------------------|
| [Employee Onboarding Buddy](docs/agents/day16-onboarding-buddy.md) | Personalized onboarding experience automation | Improves retention by 45% |
| [HR Policy QA & Triage](docs/agents/day17-hr-policy-qa.md) | Instant answers to HR policy questions | Reduces HR workload by 60% |
| [Security Posture Nanny](docs/agents/day18-security-posture.md) | Continuous security monitoring and alerts | Prevents 85% of security incidents |
| [PII Finder & Retention](docs/agents/day19-pii-finder.md) | Discovers and manages personal data | Ensures GDPR/CCPA compliance |
| [KB Gap Filler](docs/agents/day20-kb-gap-filler.md) | Identifies and fills knowledge base gaps | Reduces support tickets by 40% |
| [Support Summarizer & Router](docs/agents/day21-support-router.md) | Intelligent ticket routing and summarization | Improves resolution time by 50% |
| [Calendar Load Balancer](docs/agents/day22-calendar-balancer.md) | Optimizes meeting scheduling across teams | Saves 5+ hours/week per manager |
| [Travel & Expense Optimizer](docs/agents/day23-travel-optimizer.md) | Finds best travel deals and manages expenses | Reduces travel costs by 30% |

### 📊 Analytics & Compliance (Days 24-30)
| Agent | Description | Real-world Impact |
|-------|-------------|-------------------|
| [Inventory Demand Forecaster](docs/agents/day24-inventory-forecaster.md) | Predicts inventory needs using sales data | Reduces stockouts by 70% |
| [Invoice Fraud Anomaly Detector](docs/agents/day25-fraud-detector.md) | Detects suspicious invoices and payments | Prevents 95% of payment fraud |
| [Compliance Calendar GST/Tax](docs/agents/day26-compliance-calendar.md) | Automated compliance deadline tracking | Eliminates missed deadlines |
| [Store Review Reply Agent](docs/agents/day27-review-reply.md) | Automated responses to app store reviews | Improves app ratings by 0.5+ stars |
| [Internal Brief Memo Writer](docs/agents/day28-memo-writer.md) | Converts meeting notes to executive briefs | Saves 10+ hours/week for executives |
| [Personal Focus Coach](docs/agents/day29-focus-coach.md) | AI-powered productivity and focus optimization | Increases productivity by 40% |
| [Multi-Agent Policy Orchestrator](docs/agents/day30-orchestrator.md) | Coordinates multiple agents with policy enforcement | Enables complex workflow automation |

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Validation**: Zod schemas for type-safe data handling
- **Testing**: Vitest with comprehensive test coverage
- **Database**: Supabase (PostgreSQL) for data persistence
- **AI/LLM**: OpenRouter for multi-model AI access
- **Monitoring**: Helicone for LLM observability
- **Deployment**: Vercel-ready with GitHub Actions CI/CD

## 📚 Documentation

### **Getting Started**
- [🚀 Quick Start Guide](docs/quick-start.md) - Get up and running in 5 minutes
- [🏗️ Architecture Overview](docs/architecture.md) - System design and components
- [🔧 Configuration Guide](docs/configuration.md) - Environment variables and setup

### **Technical Guides**
- [⚙️ Technical Requirements & Alternatives](docs/technical-requirements.md) - APIs, tools, techniques, and alternatives
- [🤖 AI Models Guide](docs/ai-models-guide.md) - Latest AI models, costs, and recommendations (Oct 2025)
- [🗄️ Database & Hosting Guide](docs/database-hosting.md) - Database options, hosting platforms, and cost analysis
- [📖 API Reference](docs/api-reference.md) - Complete API documentation for all 30 agents
- [🧪 Testing Guide](docs/testing.md) - Unit, integration, and E2E testing strategies

### **Deployment & Operations**
- [🚀 Deployment Guide](docs/deployment.md) - Production deployment (Vercel, Docker, AWS, GCP)
- [🔍 Troubleshooting Guide](docs/troubleshooting.md) - Common issues, solutions, and debugging

### **Development & Contribution**
- [🎯 Agent Development Guide](docs/agent-development-guide.md) - Build custom agents with GitHub data access
- [🌐 GitHub Data Access Guide](docs/agent-development-guide.md#github-data-access-examples) - Use demo data without local setup
- [🤝 Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project

### **Demo & Sharing**
- [🎬 Demo & Sharing Guide](docs/demo-sharing.md) - Create demos, presentations, and share your work
- [📚 Resources Directory](docs/resources.md) - APIs, tools, learning resources, and community links

### **Individual Agent Documentation**
- [💰 Smart Payment Follow-Up](docs/agents/day01-smart-payment-follow-up.md) - Automate invoice payment reminders
- [📝 Meeting Action Enforcer](docs/agents/day08-meeting-actions.md) - Extract action items from meetings
- [🔍 SEO Issue Sentinel](docs/agents/day15-seo-sentinel.md) - Monitor and optimize SEO health
- [🚨 Invoice Fraud Detector](docs/agents/day25-fraud-detector.md) - Detect suspicious invoices with ML
- [📁 All Agent Docs](docs/agents/) - Complete documentation for all 30 agents

## 🌟 Key Features

### 🌐 **GitHub Data Integration**
- **Direct GitHub access** - No local setup required for team members
- **Automatic fallbacks** - Local files → GitHub → Mock data
- **Multiple access methods** - API endpoints, raw URLs, structured responses
- **CORS support** - Works from web applications and external tools
- **Real-time data** - Always up-to-date with repository changes

### Production-Ready Architecture
- Type-safe API endpoints with Zod validation
- Comprehensive error handling and logging
- Rate limiting and security best practices
- Scalable database design with Supabase

### Real-World Data Sets
- 200+ sample records per agent
- Realistic business scenarios and edge cases
- Multi-format support (CSV, JSON, XML, YAML)
- Privacy-compliant synthetic data
- **GitHub-accessible** - Available via direct URLs

### Extensive Integration Support
- 20+ external API integrations
- OAuth flows for Google, Salesforce, etc.
- Webhook handling for real-time updates
- Multi-channel communication (Email, Slack, WhatsApp)

### Developer Experience
- Hot reload development environment
- Comprehensive test coverage
- Postman collections for API testing
- Detailed documentation and examples
- **GitHub data access** - Work without local repository

## 🧪 Example Usage

### 🌐 **GitHub Data Access (New!)**
```bash
# Browse all available agents
curl http://localhost:3000/api/agents

# Get agent data directly from GitHub
curl http://localhost:3000/api/github/invoice-anomalies

# Access specific files from GitHub
curl http://localhost:3000/api/github/meeting-actions/transcript.txt

# Direct GitHub raw URLs (work anywhere)
curl https://raw.githubusercontent.com/indranilbanerjee/hackathon-agents-starter/main/data/agents-seed-pack-full/day08_Meeting_Action_Enforcer/transcript.txt
```

### 🤖 **Agent Endpoints**
```bash
# Meeting Action Enforcer
curl -X POST http://localhost:3000/api/meeting-actions \
  -H "Content-Type: application/json" \
  -d '{"path": "/path/to/transcript.txt"}'

# Invoice Anomaly Detection
curl http://localhost:3000/api/invoice-anomalies

# Support Ticket Summarization
curl -X POST http://localhost:3000/api/support-brief \
  -H "Content-Type: application/json" \
  -d '{"path": "/path/to/tickets.json"}'
```

### 📊 **Data Access Patterns**
```bash
# Local + GitHub fallback (automatic)
curl http://localhost:3000/api/agents/invoice-anomalies/data

# Specific file with GitHub fallback
curl http://localhost:3000/api/agents/invoice-anomalies/data?file=invoices.csv

# Raw file content
curl http://localhost:3000/api/agents/invoice-anomalies/data?file=invoices.csv&format=raw
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for the developer community
- Inspired by real-world business automation needs
- Powered by cutting-edge AI and modern web technologies

---

**Ready to build the future of business automation?** 🚀

[Get Started](docs/quick-start.md) | [GitHub Data Access](docs/agent-development-guide.md#github-data-access-examples) | [View Agents](docs/agents/) | [API Docs](docs/api-reference.md)
