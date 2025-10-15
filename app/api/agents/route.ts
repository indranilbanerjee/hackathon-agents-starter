/**
 * Agents API - Central endpoint for accessing all 30 agents and their demo data
 * Provides standardized access to agent configurations and demo data
 */

import { NextRequest, NextResponse } from "next/server";
import { 
  AGENT_REGISTRY, 
  getAgentConfig, 
  getAgentsByCategory, 
  getImplementedAgents, 
  getPlannedAgents,
  getCategories 
} from "@/lib/agent-registry";
import { getAgentDemoData } from "@/lib/data-access";

/**
 * GET /api/agents - List all agents or get specific agent info
 * Query parameters:
 * - category: Filter by category (Financial, Marketing, etc.)
 * - status: Filter by status (implemented, planned, in-progress)
 * - agent: Get specific agent by ID
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const agentId = searchParams.get('agent');

    // Get specific agent
    if (agentId) {
      const agent = getAgentConfig(agentId);
      if (!agent) {
        return NextResponse.json(
          { error: `Agent '${agentId}' not found` },
          { status: 404 }
        );
      }

      return NextResponse.json({
        agent,
        dataPath: `/api/agents/${agentId}/data`,
        apiEndpoint: agent.apiRoute,
        documentation: `/docs/agents/${agent.dayFolder.toLowerCase().replace(/_/g, '-')}.md`
      });
    }

    // Filter agents
    let agents = Object.values(AGENT_REGISTRY);

    if (category) {
      agents = getAgentsByCategory(category);
    }

    if (status) {
      agents = agents.filter(agent => agent.status === status);
    }

    // Get summary statistics
    const stats = {
      total: Object.keys(AGENT_REGISTRY).length,
      implemented: getImplementedAgents().length,
      planned: getPlannedAgents().length,
      categories: getCategories()
    };

    return NextResponse.json({
      agents,
      stats,
      endpoints: {
        getAgent: '/api/agents?agent={agentId}',
        getAgentData: '/api/agents/{agentId}/data',
        filterByCategory: '/api/agents?category={category}',
        filterByStatus: '/api/agents?status={status}'
      }
    });

  } catch (error) {
    console.error("Agents API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents - Create or update agent configuration
 * (For future use - agent development workflow)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, agentId, config } = body;

    switch (action) {
      case 'validate':
        // Validate agent configuration
        const agent = getAgentConfig(agentId);
        if (!agent) {
          return NextResponse.json(
            { valid: false, error: `Agent '${agentId}' not found` },
            { status: 404 }
          );
        }

        // Check if data files exist
        const demoData = await getAgentDemoData(agentId);
        const dataStatus = Object.entries(demoData).map(([filename, result]) => ({
          filename,
          exists: result.success,
          source: result.source
        }));

        return NextResponse.json({
          valid: true,
          agent,
          dataStatus,
          recommendations: generateRecommendations(agent, dataStatus)
        });

      case 'test':
        // Test agent with demo data
        const testData = await getAgentDemoData(agentId);
        return NextResponse.json({
          agentId,
          testData,
          timestamp: new Date().toISOString(),
          status: 'success'
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Agents API POST Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

/**
 * Generate recommendations for agent development
 */
function generateRecommendations(agent: any, dataStatus: any[]): string[] {
  const recommendations = [];

  // Check implementation status
  if (agent.status === 'planned') {
    recommendations.push(`Implement API route at ${agent.apiRoute}`);
    recommendations.push(`Create comprehensive tests for ${agent.name}`);
  }

  // Check data availability
  const missingData = dataStatus.filter(d => !d.exists);
  if (missingData.length > 0) {
    recommendations.push(`Add demo data files: ${missingData.map(d => d.filename).join(', ')}`);
  }

  // Check documentation
  recommendations.push(`Review documentation at /docs/agents/${agent.dayFolder.toLowerCase().replace(/_/g, '-')}.md`);

  // Complexity-based recommendations
  if (agent.complexity >= 4) {
    recommendations.push('Consider implementing ML/AI components for enhanced functionality');
    recommendations.push('Add comprehensive error handling and fallback mechanisms');
  }

  if (agent.complexity >= 5) {
    recommendations.push('Implement advanced analytics and reporting features');
    recommendations.push('Add real-time monitoring and alerting capabilities');
  }

  return recommendations;
}
