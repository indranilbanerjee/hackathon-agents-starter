/**
 * Data Access Utility - Standardized way to access demo data for all agents
 * Provides fallback mechanisms and mock data generation
 */

import { readFileSync, existsSync } from "node:fs";
import { getAgentConfig, getAgentDataPath } from "./agent-registry";
import {
  loadAgentDataFromGitHub,
  parseCSV,
  parseJSON,
  generateGitHubUrls,
  getAgentDemoDataFromGitHub,
  type GitHubDataResult
} from "./github-data-access";

export interface DataAccessResult<T = any> {
  data: T;
  source: string;
  success: boolean;
  error?: string;
  githubUrls?: {
    raw: string;
    blob: string;
    api: string;
    folder: string;
  };
}

/**
 * Generic data loader with fallback mechanisms
 */
export async function loadAgentData<T = any>(
  agentId: string, 
  filename: string,
  parser?: (content: string) => T,
  mockData?: T
): Promise<DataAccessResult<T>> {
  const agent = getAgentConfig(agentId);
  
  if (!agent) {
    return {
      data: mockData as T,
      source: 'error',
      success: false,
      error: `Agent '${agentId}' not found in registry`
    };
  }

  const possiblePaths = getAgentDataPath(agentId, filename);
  
  // Try each path until we find one that exists
  for (const path of possiblePaths) {
    try {
      if (existsSync(path)) {
        const content = readFileSync(path, "utf8");
        const parsedData = parser ? parser(content) : (content as T);
        
        return {
          data: parsedData,
          source: path,
          success: true
        };
      }
    } catch (error) {
      continue;
    }
  }

  const githubUrls = generateGitHubUrls(agent.dayFolder, filename);

  // Try GitHub as fallback
  try {
    const githubResult = await loadAgentDataFromGitHub(
      agent.dayFolder,
      filename,
      parser,
      mockData
    );

    if (githubResult.success) {
      return {
        data: githubResult.data,
        source: `github-${githubResult.source}`,
        success: true,
        githubUrls
      };
    }
  } catch (error) {
    // Continue to mock data fallback
  }

  // If no file found, use mock data
  if (mockData) {
    return {
      data: mockData,
      source: 'mock-data',
      success: true,
      githubUrls
    };
  }

  return {
    data: null as T,
    source: 'not-found',
    success: false,
    error: `No data file found for ${agentId}/${filename} in local paths or GitHub`,
    githubUrls
  };
}

/**
 * Load CSV data with automatic parsing
 */
export async function loadCSVData(
  agentId: string, 
  filename: string,
  mockData?: any[]
): Promise<DataAccessResult<any[]>> {
  const csvParser = (content: string) => {
    const lines = content.trim().split(/\r?\n/);
    const [header, ...rows] = lines;
    const headers = header.split(',');
    
    return rows.map(row => {
      const values = row.split(',');
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = values[i]?.trim() || '';
      });
      return obj;
    });
  };

  return loadAgentData(agentId, filename, csvParser, mockData);
}

/**
 * Load JSON data with automatic parsing
 */
export async function loadJSONData<T = any>(
  agentId: string, 
  filename: string,
  mockData?: T
): Promise<DataAccessResult<T>> {
  const jsonParser = (content: string) => JSON.parse(content);
  return loadAgentData(agentId, filename, jsonParser, mockData);
}

/**
 * Load text data (for transcripts, etc.)
 */
export async function loadTextData(
  agentId: string, 
  filename: string,
  mockData?: string
): Promise<DataAccessResult<string>> {
  return loadAgentData(agentId, filename, undefined, mockData);
}

/**
 * Load XML data (for sitemaps, etc.)
 */
export async function loadXMLData(
  agentId: string, 
  filename: string,
  mockData?: string
): Promise<DataAccessResult<string>> {
  return loadAgentData(agentId, filename, undefined, mockData);
}

/**
 * Mock data generators for common data types
 */
export const MockDataGenerators = {
  /**
   * Generate mock invoice data
   */
  invoices: (count: number = 10) => {
    const vendors = ['TechCorp', 'DataSys', 'CloudServ', 'DevTools', 'Enterprise', 'MegaCorp', 'StartupInc'];
    const statuses = ['paid', 'pending', 'overdue'];
    
    return Array.from({ length: count }, (_, i) => ({
      invoice_id: `INV-${String(i + 1).padStart(3, '0')}`,
      vendor: vendors[i % vendors.length],
      amount: Math.floor(Math.random() * 50000) + 1000,
      date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: statuses[i % statuses.length],
      iban: 'GB33BUKB20201555555555',
      created_at_utc: new Date().toISOString()
    }));
  },

  /**
   * Generate mock meeting transcript
   */
  meetingTranscript: () => `Meeting Transcript - Project Planning Session

John: We need to finalize the budget by Friday. @Sarah can you prepare the financial report?
Sarah: Sure, I'll have it ready by Thursday. @Mike, can you review the technical requirements?
Mike: I'll review them by Wednesday and send feedback. @John, we should schedule a follow-up meeting.
John: Good idea. Let's meet again next Monday to discuss the final details.
Alice: @Tom, please update the project timeline based on today's discussion.
Tom: Will do. I'll have the updated timeline ready by tomorrow.`,

  /**
   * Generate mock support tickets
   */
  supportTickets: (count: number = 5) => {
    const subjects = [
      'Billing Issue - Incorrect Charges',
      'Login Problems',
      'Feature Request - Dashboard',
      'Bug Report - Data Export',
      'Account Access Issues'
    ];
    
    const priorities = ['low', 'medium', 'high', 'critical'];
    const statuses = ['open', 'in_progress', 'resolved', 'closed'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `TICKET-${String(i + 1).padStart(3, '0')}`,
      subject: subjects[i % subjects.length],
      description: `Customer reports issue with ${subjects[i % subjects.length].toLowerCase()}`,
      priority: priorities[i % priorities.length],
      status: statuses[i % statuses.length],
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      customer_id: `CUST-${String(i + 1).padStart(3, '0')}`
    }));
  },

  /**
   * Generate mock sitemap XML
   */
  sitemap: () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2024-01-02</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/products</loc>
    <lastmod>2024-01-03</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://example.com/contact</loc>
    <lastmod>2024-01-04</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://example.com/blog</loc>
    <lastmod>2024-01-05</lastmod>
    <priority>0.6</priority>
  </url>
</urlset>`,

  /**
   * Generate mock vendor data
   */
  vendors: (count: number = 5) => {
    const companies = ['TechCorp Ltd', 'DataSys Inc', 'CloudServ Solutions', 'DevTools Pro', 'Enterprise Systems'];
    
    return Array.from({ length: count }, (_, i) => ({
      vendor_id: `VEN-${String(i + 1).padStart(3, '0')}`,
      name: companies[i % companies.length],
      email: `contact@${companies[i % companies.length].toLowerCase().replace(/\s+/g, '')}.com`,
      tax_id: `TAX${String(i + 1).padStart(6, '0')}`,
      bank_account: `GB33BUKB20201${String(i + 1).padStart(9, '0')}`,
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    }));
  },

  /**
   * Generate mock action items
   */
  actionItems: () => [
    {
      owner: 'Sarah',
      title: 'Prepare financial report',
      due: '2025-10-20',
      priority: 'high'
    },
    {
      owner: 'Mike',
      title: 'Review technical requirements',
      due: '2025-10-18',
      priority: 'medium'
    },
    {
      owner: 'Tom',
      title: 'Update project timeline',
      due: '2025-10-17',
      priority: 'medium'
    }
  ]
};

/**
 * Get demo data for a specific agent with automatic fallback to mock data
 */
export async function getAgentDemoData(agentId: string): Promise<Record<string, any>> {
  const agent = getAgentConfig(agentId);
  if (!agent) {
    throw new Error(`Agent '${agentId}' not found`);
  }

  const demoData: Record<string, any> = {};

  // Load each data file for the agent
  for (const filename of agent.dataFiles) {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    try {
      let result: DataAccessResult<any>;
      
      switch (extension) {
        case 'csv':
          if (filename.includes('invoice')) {
            result = await loadCSVData(agentId, filename, MockDataGenerators.invoices());
          } else if (filename.includes('vendor')) {
            result = await loadCSVData(agentId, filename, MockDataGenerators.vendors());
          } else {
            result = await loadCSVData(agentId, filename, []);
          }
          break;
          
        case 'json':
          if (filename.includes('ticket')) {
            result = await loadJSONData(agentId, filename, MockDataGenerators.supportTickets());
          } else if (filename.includes('action')) {
            result = await loadJSONData(agentId, filename, MockDataGenerators.actionItems());
          } else {
            result = await loadJSONData(agentId, filename, {});
          }
          break;
          
        case 'txt':
          if (filename.includes('transcript')) {
            result = await loadTextData(agentId, filename, MockDataGenerators.meetingTranscript());
          } else {
            result = await loadTextData(agentId, filename, 'Sample text data');
          }
          break;
          
        case 'xml':
          if (filename.includes('sitemap')) {
            result = await loadXMLData(agentId, filename, MockDataGenerators.sitemap());
          } else {
            result = await loadXMLData(agentId, filename, '<?xml version="1.0"?><root></root>');
          }
          break;
          
        default:
          result = await loadTextData(agentId, filename, 'Unknown file type');
      }
      
      demoData[filename] = {
        data: result.data,
        source: result.source,
        success: result.success
      };
      
    } catch (error) {
      demoData[filename] = {
        data: null,
        source: 'error',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  return demoData;
}
