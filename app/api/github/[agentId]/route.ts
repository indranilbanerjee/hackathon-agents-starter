/**
 * GitHub Agent Data API - Access all data for an agent from GitHub
 * GET /api/github/{agentId} - Get all demo data for an agent from GitHub
 * 
 * This endpoint provides a complete view of an agent's demo data
 * fetched directly from the GitHub repository.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAgentConfig } from "@/lib/agent-registry";
import { 
  getAgentDemoDataFromGitHub,
  getAgentFilesFromGitHub,
  generateGitHubUrls 
} from "@/lib/github-data-access";

interface RouteParams {
  params: {
    agentId: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { agentId } = params;
    const { searchParams } = new URL(req.url);
    const includeData = searchParams.get('includeData') !== 'false'; // Default true
    const listFiles = searchParams.get('listFiles') === 'true'; // Default false

    // Validate agent exists
    const agent = getAgentConfig(agentId);
    if (!agent) {
      return NextResponse.json(
        { error: `Agent '${agentId}' not found` },
        { status: 404 }
      );
    }

    const urls = generateGitHubUrls(agent.dayFolder, '');
    const response: any = {
      agent: {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        category: agent.category,
        complexity: agent.complexity,
        status: agent.status,
        dayFolder: agent.dayFolder,
        apiRoute: agent.apiRoute
      },
      dataFiles: agent.dataFiles,
      githubUrls: {
        folder: urls.folder,
        raw: `https://raw.githubusercontent.com/indranilbanerjee/hackathon-agents-starter/main/data/agents-seed-pack-full/${agent.dayFolder}/`,
        api: `https://api.github.com/repos/indranilbanerjee/hackathon-agents-starter/contents/data/agents-seed-pack-full/${agent.dayFolder}`
      },
      usage: {
        getAllData: `/api/github/${agentId}`,
        getSpecificFile: `/api/github/${agentId}/{filename}`,
        getRawFile: `/api/github/${agentId}/{filename}?format=raw`,
        localAgentData: `/api/agents/${agentId}/data`,
        agentEndpoint: agent.apiRoute
      },
      timestamp: new Date().toISOString()
    };

    // List files from GitHub if requested
    if (listFiles) {
      const filesResult = await getAgentFilesFromGitHub(agent.dayFolder);
      response.githubFiles = {
        success: filesResult.success,
        files: filesResult.data,
        source: filesResult.source,
        error: filesResult.error
      };
    }

    // Include demo data if requested
    if (includeData) {
      const demoData = await getAgentDemoDataFromGitHub(agent.dayFolder, agent.dataFiles);
      
      response.demoData = {};
      response.dataStatus = {};
      
      for (const [filename, result] of Object.entries(demoData)) {
        response.demoData[filename] = result.success ? result.data : null;
        response.dataStatus[filename] = {
          success: result.success,
          source: result.source,
          error: result.error,
          url: result.url
        };
      }
      
      // Summary statistics
      const successCount = Object.values(demoData).filter(r => r.success).length;
      response.summary = {
        totalFiles: agent.dataFiles.length,
        successfullyLoaded: successCount,
        failedToLoad: agent.dataFiles.length - successCount,
        allDataAvailable: successCount === agent.dataFiles.length
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error(`GitHub Agent Data Error for ${params.agentId}:`, error);
    return NextResponse.json(
      { 
        error: "Failed to fetch agent data from GitHub",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/github/{agentId} - Test agent with GitHub data
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { agentId } = params;
    const body = await req.json();

    // Validate agent exists
    const agent = getAgentConfig(agentId);
    if (!agent) {
      return NextResponse.json(
        { error: `Agent '${agentId}' not found` },
        { status: 404 }
      );
    }

    // Check if agent is implemented
    if (agent.status !== 'implemented') {
      return NextResponse.json(
        { 
          error: `Agent '${agentId}' is not yet implemented`,
          status: agent.status,
          apiRoute: agent.apiRoute,
          message: `This agent is currently ${agent.status}. Check back later for implementation.`,
          githubData: `/api/github/${agentId}`,
          developmentGuide: '/docs/agent-development-guide.md'
        },
        { status: 501 }
      );
    }

    // For implemented agents, test with GitHub data
    const demoData = await getAgentDemoDataFromGitHub(agent.dayFolder, agent.dataFiles);
    
    return NextResponse.json({
      agent: {
        id: agent.id,
        name: agent.name
      },
      testData: demoData,
      message: "Agent tested with GitHub demo data",
      note: "To run the actual agent logic, use the agent's specific API endpoint",
      agentEndpoint: agent.apiRoute,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error(`GitHub Agent Test Error for ${params.agentId}:`, error);
    return NextResponse.json(
      { 
        error: "Failed to test agent with GitHub data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS support
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
