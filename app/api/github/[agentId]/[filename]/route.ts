/**
 * GitHub Data Proxy API - Direct access to agent data from GitHub
 * GET /api/github/{agentId}/{filename} - Fetch specific file from GitHub
 * 
 * This endpoint allows team members to access demo data directly from GitHub
 * without needing local repository setup or cloning.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAgentConfig } from "@/lib/agent-registry";
import { 
  fetchFromGitHubRaw, 
  fetchFromGitHubAPI, 
  parseCSV, 
  parseJSON,
  generateGitHubUrls 
} from "@/lib/github-data-access";

interface RouteParams {
  params: {
    agentId: string;
    filename: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { agentId, filename } = params;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json'; // json, raw, csv
    const method = searchParams.get('method') || 'raw'; // raw, api

    // Validate agent exists
    const agent = getAgentConfig(agentId);
    if (!agent) {
      return NextResponse.json(
        { error: `Agent '${agentId}' not found` },
        { status: 404 }
      );
    }

    // Validate filename is in agent's data files
    if (!agent.dataFiles.includes(filename)) {
      return NextResponse.json(
        { 
          error: `File '${filename}' not found for agent '${agentId}'`,
          availableFiles: agent.dataFiles,
          githubFolder: generateGitHubUrls(agent.dayFolder, '').folder
        },
        { status: 404 }
      );
    }

    // Determine parser based on file extension
    const extension = filename.split('.').pop()?.toLowerCase() || 'txt';
    let parser: ((content: string) => any) | undefined;

    switch (extension) {
      case 'csv':
        parser = parseCSV;
        break;
      case 'json':
        parser = parseJSON;
        break;
      // txt and xml files are returned as strings (no parsing needed)
    }

    // Fetch from GitHub
    const result = method === 'api' 
      ? await fetchFromGitHubAPI(agent.dayFolder, filename, parser)
      : await fetchFromGitHubRaw(agent.dayFolder, filename, parser);

    if (!result.success) {
      const urls = generateGitHubUrls(agent.dayFolder, filename);
      return NextResponse.json(
        { 
          error: result.error,
          source: result.source,
          githubUrls: urls,
          troubleshooting: {
            message: "Try accessing the file directly via GitHub",
            rawUrl: urls.raw,
            blobUrl: urls.blob,
            folderUrl: urls.folder
          }
        },
        { status: 404 }
      );
    }

    // Return in requested format
    if (format === 'raw') {
      return new Response(
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2),
        {
          headers: {
            'Content-Type': getContentType(extension),
            'X-Data-Source': result.source,
            'X-GitHub-URL': result.url || '',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    const urls = generateGitHubUrls(agent.dayFolder, filename);

    return NextResponse.json({
      filename,
      data: result.data,
      source: result.source,
      githubUrl: result.url,
      agent: {
        id: agent.id,
        name: agent.name,
        category: agent.category,
        dayFolder: agent.dayFolder
      },
      githubUrls: urls,
      usage: {
        rawData: `/api/github/${agentId}/${filename}?format=raw`,
        apiMethod: `/api/github/${agentId}/${filename}?method=api`,
        directGitHub: urls.raw,
        viewOnGitHub: urls.blob
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`GitHub Data Proxy Error for ${params.agentId}/${params.filename}:`, error);
    return NextResponse.json(
      { 
        error: "Failed to fetch data from GitHub",
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

/**
 * OPTIONS handler for CORS support
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
