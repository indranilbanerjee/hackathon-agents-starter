/**
 * Agent Data API - Access demo data for any specific agent
 * GET /api/agents/{agentId}/data - Get all demo data for an agent
 * GET /api/agents/{agentId}/data?file={filename} - Get specific data file
 */

import { NextRequest, NextResponse } from "next/server";
import { getAgentConfig } from "@/lib/agent-registry";
import { getAgentDemoData, loadCSVData, loadJSONData, loadTextData, loadXMLData } from "@/lib/data-access";

interface RouteParams {
  params: {
    agentId: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { agentId } = params;
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('file');
    const format = searchParams.get('format') || 'json'; // json, raw, csv

    // Validate agent exists
    const agent = getAgentConfig(agentId);
    if (!agent) {
      return NextResponse.json(
        { error: `Agent '${agentId}' not found` },
        { status: 404 }
      );
    }

    // Get specific file
    if (filename) {
      // Validate filename is in agent's data files
      if (!agent.dataFiles.includes(filename)) {
        return NextResponse.json(
          { 
            error: `File '${filename}' not found for agent '${agentId}'`,
            availableFiles: agent.dataFiles
          },
          { status: 404 }
        );
      }

      const extension = filename.split('.').pop()?.toLowerCase() || 'txt';
      let result;

      switch (extension) {
        case 'csv':
          result = await loadCSVData(agentId, filename);
          break;
        case 'json':
          result = await loadJSONData(agentId, filename);
          break;
        case 'txt':
          result = await loadTextData(agentId, filename);
          break;
        case 'xml':
          result = await loadXMLData(agentId, filename);
          break;
        default:
          result = await loadTextData(agentId, filename);
      }

      if (!result.success) {
        return NextResponse.json(
          { 
            error: result.error || `Failed to load ${filename}`,
            source: result.source
          },
          { status: 404 }
        );
      }

      // Return in requested format
      if (format === 'raw') {
        return new Response(
          typeof result.data === 'string' ? result.data : JSON.stringify(result.data),
          {
            headers: {
              'Content-Type': getContentType(extension),
              'X-Data-Source': result.source
            }
          }
        );
      }

      return NextResponse.json({
        filename,
        data: result.data,
        source: result.source,
        agent: {
          id: agent.id,
          name: agent.name,
          category: agent.category
        }
      });
    }

    // Get all demo data for the agent
    const demoData = await getAgentDemoData(agentId);

    return NextResponse.json({
      agent: {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        category: agent.category,
        complexity: agent.complexity,
        status: agent.status,
        apiRoute: agent.apiRoute
      },
      dataFiles: agent.dataFiles,
      demoData,
      usage: {
        getAllData: `/api/agents/${agentId}/data`,
        getSpecificFile: `/api/agents/${agentId}/data?file={filename}`,
        getRawFile: `/api/agents/${agentId}/data?file={filename}&format=raw`,
        agentEndpoint: agent.apiRoute
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`Agent Data API Error for ${params.agentId}:`, error);
    return NextResponse.json(
      { 
        error: "Failed to fetch agent data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents/{agentId}/data - Process data with agent logic
 * This endpoint allows testing agent functionality with custom data
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
          message: `This agent is currently ${agent.status}. Check back later for implementation.`
        },
        { status: 501 }
      );
    }

    // For implemented agents, redirect to their specific API endpoint
    const agentUrl = new URL(agent.apiRoute, req.url);
    
    // Forward the request to the agent's specific endpoint
    const response = await fetch(agentUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    return NextResponse.json({
      agent: {
        id: agent.id,
        name: agent.name
      },
      result: data,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error(`Agent Data POST Error for ${params.agentId}:`, error);
    return NextResponse.json(
      { 
        error: "Failed to process data with agent",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

/**
 * Get appropriate content type for file extension
 */
function getContentType(extension: string): string {
  switch (extension) {
    case 'json':
      return 'application/json';
    case 'csv':
      return 'text/csv';
    case 'xml':
      return 'application/xml';
    case 'txt':
      return 'text/plain';
    default:
      return 'text/plain';
  }
}
