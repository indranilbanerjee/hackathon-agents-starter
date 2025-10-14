# 🚀 Deployment Guide

Complete guide for deploying the 30 Agents Starter Repository to production.

## Deployment Options

### 1. Vercel (Recommended)
- **Best for**: Quick deployment, automatic scaling
- **Pros**: Zero config, GitHub integration, edge functions
- **Cons**: Vendor lock-in, function timeout limits

### 2. Docker + Cloud Providers
- **Best for**: Full control, multi-cloud deployment
- **Pros**: Portable, scalable, customizable
- **Cons**: More setup required

### 3. Traditional VPS/Dedicated Servers
- **Best for**: Cost optimization, specific requirements
- **Pros**: Full control, cost-effective for high traffic
- **Cons**: Manual scaling, maintenance overhead

## Vercel Deployment

### Prerequisites
- GitHub account with repository access
- Vercel account (free tier available)
- Environment variables configured

### Step-by-Step Deployment

#### 1. Prepare Repository
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### 2. Connect to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure project settings

#### 3. Environment Variables
In Vercel dashboard, add these environment variables:

```bash
# Core AI Services
OPENROUTER_API_KEY=sk-or-v1-xxxxx
HELICONE_API_KEY=sk-helicone-xxxxx

# Database
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# External APIs (as needed)
SLACK_BOT_TOKEN=xoxb-xxxxx
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
HUBSPOT_API_KEY=pat-na1-xxxxx
```

#### 4. Build Configuration
Create `vercel.json` in project root:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["iad1", "sfo1"]
}
```

#### 5. Deploy
```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from command line
vercel --prod

# Or use GitHub integration (automatic)
git push origin main
```

## Docker Deployment

### Dockerfile
```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - HELICONE_API_KEY=${HELICONE_API_KEY}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

### Build and Deploy
```bash
# Build the image
docker build -t agents-starter .

# Run with Docker Compose
docker-compose up -d

# Or run standalone
docker run -p 3000:3000 \
  -e OPENROUTER_API_KEY=your_key \
  -e HELICONE_API_KEY=your_key \
  agents-starter
```

## AWS Deployment

### Using AWS App Runner
```yaml
# apprunner.yaml
version: 1.0
runtime: nodejs18
build:
  commands:
    build:
      - npm ci
      - npm run build
run:
  runtime-version: 18
  command: npm start
  network:
    port: 3000
    env: PORT
  env:
    - name: NODE_ENV
      value: production
```

### Using ECS with Fargate
```json
{
  "family": "agents-starter",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "agents-starter",
      "image": "your-account.dkr.ecr.region.amazonaws.com/agents-starter:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "OPENROUTER_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:agents-starter/openrouter"
        }
      ]
    }
  ]
}
```

## Google Cloud Platform

### Using Cloud Run
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/agents-starter', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/agents-starter']
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'agents-starter'
      - '--image'
      - 'gcr.io/$PROJECT_ID/agents-starter'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

Deploy with:
```bash
gcloud builds submit --config cloudbuild.yaml
```

## Environment Configuration

### Production Environment Variables
```bash
# Core Configuration
NODE_ENV=production
PORT=3000

# AI Services
OPENROUTER_API_KEY=sk-or-v1-xxxxx
HELICONE_API_KEY=sk-helicone-xxxxx

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://user:pass@host:6379

# Security
JWT_SECRET=your-super-secret-jwt-key
API_KEY_SALT=your-api-key-salt

# External Services
SLACK_BOT_TOKEN=xoxb-xxxxx
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
HUBSPOT_API_KEY=pat-na1-xxxxx

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
LOG_LEVEL=info
```

### Security Best Practices

#### 1. API Key Management
```bash
# Use environment-specific keys
OPENROUTER_API_KEY_DEV=sk-or-v1-dev-xxxxx
OPENROUTER_API_KEY_PROD=sk-or-v1-prod-xxxxx

# Rotate keys quarterly
# Use least-privilege access
# Monitor usage and set alerts
```

#### 2. Database Security
```bash
# Use connection pooling
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=30000

# Enable SSL
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true

# Use read replicas for scaling
DATABASE_READ_URL=postgresql://readonly:pass@read-host:5432/db
```

#### 3. Rate Limiting
```typescript
// lib/rate-limiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 h"),
  analytics: true,
});

export { ratelimit };
```

## Monitoring & Observability

### Health Checks
```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = await Promise.allSettled([
    checkDatabase(),
    checkRedis(),
    checkExternalAPIs(),
    checkDiskSpace(),
    checkMemoryUsage()
  ]);

  const health = {
    status: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks: checks.map((check, index) => ({
      name: ['database', 'redis', 'external_apis', 'disk', 'memory'][index],
      status: check.status,
      ...(check.status === 'rejected' && { error: check.reason })
    }))
  };

  return Response.json(health, {
    status: health.status === 'healthy' ? 200 : 503
  });
}
```

### Logging Configuration
```typescript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export { logger };
```

### Metrics Collection
```typescript
// lib/metrics.ts
import { createPrometheusMetrics } from '@prometheus/client';

export const metrics = {
  httpRequests: new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status']
  }),
  
  agentExecutions: new Counter({
    name: 'agent_executions_total',
    help: 'Total number of agent executions',
    labelNames: ['agent', 'status']
  }),
  
  llmTokens: new Counter({
    name: 'llm_tokens_total',
    help: 'Total LLM tokens consumed',
    labelNames: ['model', 'type']
  })
};
```

## Performance Optimization

### Caching Strategy
```typescript
// lib/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCached<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  return cached ? JSON.parse(cached) : null;
}

export async function setCache<T>(
  key: string, 
  value: T, 
  ttl: number = 3600
): Promise<void> {
  await redis.setex(key, ttl, JSON.stringify(value));
}
```

### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_vendor_id ON invoices(vendor_id);
CREATE INDEX idx_action_items_owner ON action_items(owner);
CREATE INDEX idx_action_items_due_date ON action_items(due_date);

-- Optimize for time-series data
CREATE INDEX idx_agent_runs_created_at ON agent_runs(created_at DESC);
```

## Backup & Disaster Recovery

### Database Backups
```bash
# Automated daily backups
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backups/agents_db_$DATE.sql
aws s3 cp backups/agents_db_$DATE.sql s3://your-backup-bucket/

# Retention policy (keep 30 days)
find backups/ -name "*.sql" -mtime +30 -delete
```

### Application Backups
```bash
# Backup configuration and data
tar -czf backup_$DATE.tar.gz \
  data/ \
  docs/ \
  .env.production \
  package.json

aws s3 cp backup_$DATE.tar.gz s3://your-backup-bucket/app-backups/
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancers (ALB, CloudFlare)
- Implement session affinity if needed
- Scale database with read replicas
- Use Redis for shared state

### Vertical Scaling
- Monitor CPU and memory usage
- Optimize database queries
- Implement connection pooling
- Use CDN for static assets

### Auto-scaling Configuration
```yaml
# Kubernetes HPA example
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: agents-starter-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: agents-starter
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### 2. Environment Variable Issues
```bash
# Verify environment variables
printenv | grep -E "(OPENROUTER|HELICONE|SUPABASE)"

# Test API connectivity
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
     https://openrouter.ai/api/v1/models
```

#### 3. Database Connection Issues
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check connection pool
SELECT count(*) FROM pg_stat_activity;
```

### Monitoring Alerts
Set up alerts for:
- High error rates (>5%)
- Slow response times (>2s)
- High memory usage (>80%)
- Database connection failures
- External API failures

This deployment guide ensures your agents run reliably in production with proper monitoring, security, and scalability.
