/**
 * GitHub Data Access - Fetch demo data directly from GitHub repository
 * Allows team members to access agent data without local repository setup
 */

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  basePath: string;
}

export interface GitHubDataResult<T = any> {
  data: T;
  source: string;
  success: boolean;
  error?: string;
  url?: string;
}

// Default GitHub configuration
const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  owner: 'indranilbanerjee',
  repo: 'hackathon-agents-starter',
  branch: 'main',
  basePath: 'data/agents-seed-pack-full'
};

/**
 * Fetch data directly from GitHub raw URLs
 */
export async function fetchFromGitHubRaw<T = any>(
  agentDayFolder: string,
  filename: string,
  parser?: (content: string) => T,
  config: GitHubConfig = DEFAULT_GITHUB_CONFIG
): Promise<GitHubDataResult<T>> {
  
  const rawUrl = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${config.basePath}/${agentDayFolder}/${filename}`;
  
  try {
    const response = await fetch(rawUrl);
    
    if (!response.ok) {
      return {
        data: null as T,
        source: 'github-raw',
        success: false,
        error: `GitHub fetch failed: ${response.status} ${response.statusText}`,
        url: rawUrl
      };
    }
    
    const content = await response.text();
    const parsedData = parser ? parser(content) : (content as T);
    
    return {
      data: parsedData,
      source: 'github-raw',
      success: true,
      url: rawUrl
    };
    
  } catch (error) {
    return {
      data: null as T,
      source: 'github-raw',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url: rawUrl
    };
  }
}

/**
 * Fetch data using GitHub API (with authentication support)
 */
export async function fetchFromGitHubAPI<T = any>(
  agentDayFolder: string,
  filename: string,
  parser?: (content: string) => T,
  config: GitHubConfig = DEFAULT_GITHUB_CONFIG,
  githubToken?: string
): Promise<GitHubDataResult<T>> {
  
  const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.basePath}/${agentDayFolder}/${filename}?ref=${config.branch}`;
  
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Agents-Starter-Repo'
    };
    
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }
    
    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      return {
        data: null as T,
        source: 'github-api',
        success: false,
        error: `GitHub API fetch failed: ${response.status} ${response.statusText}`,
        url: apiUrl
      };
    }
    
    const apiResponse = await response.json();
    
    if (apiResponse.type !== 'file') {
      return {
        data: null as T,
        source: 'github-api',
        success: false,
        error: 'Not a file',
        url: apiUrl
      };
    }
    
    // Decode base64 content
    const content = Buffer.from(apiResponse.content, 'base64').toString('utf-8');
    const parsedData = parser ? parser(content) : (content as T);
    
    return {
      data: parsedData,
      source: 'github-api',
      success: true,
      url: apiUrl
    };
    
  } catch (error) {
    return {
      data: null as T,
      source: 'github-api',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url: apiUrl
    };
  }
}

/**
 * Get list of files in an agent's data folder from GitHub
 */
export async function getAgentFilesFromGitHub(
  agentDayFolder: string,
  config: GitHubConfig = DEFAULT_GITHUB_CONFIG,
  githubToken?: string
): Promise<GitHubDataResult<string[]>> {
  
  const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.basePath}/${agentDayFolder}?ref=${config.branch}`;
  
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Agents-Starter-Repo'
    };
    
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`;
    }
    
    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      return {
        data: [],
        source: 'github-api',
        success: false,
        error: `GitHub API fetch failed: ${response.status} ${response.statusText}`,
        url: apiUrl
      };
    }
    
    const files = await response.json();
    const filenames = files
      .filter((item: any) => item.type === 'file')
      .map((item: any) => item.name);
    
    return {
      data: filenames,
      source: 'github-api',
      success: true,
      url: apiUrl
    };
    
  } catch (error) {
    return {
      data: [],
      source: 'github-api',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url: apiUrl
    };
  }
}

/**
 * Enhanced data loading with GitHub fallback
 */
export async function loadAgentDataFromGitHub<T = any>(
  agentDayFolder: string,
  filename: string,
  parser?: (content: string) => T,
  mockData?: T,
  config: GitHubConfig = DEFAULT_GITHUB_CONFIG
): Promise<GitHubDataResult<T>> {
  
  // Try GitHub Raw first (faster, no rate limits)
  const rawResult = await fetchFromGitHubRaw(agentDayFolder, filename, parser, config);
  if (rawResult.success) {
    return rawResult;
  }
  
  // Fallback to GitHub API
  const apiResult = await fetchFromGitHubAPI(agentDayFolder, filename, parser, config);
  if (apiResult.success) {
    return apiResult;
  }
  
  // Use mock data if provided
  if (mockData !== undefined) {
    return {
      data: mockData,
      source: 'mock-data',
      success: true,
      error: `GitHub access failed, using mock data. Raw error: ${rawResult.error}, API error: ${apiResult.error}`
    };
  }
  
  // Return failure
  return {
    data: null as T,
    source: 'github-failed',
    success: false,
    error: `All GitHub access methods failed. Raw: ${rawResult.error}, API: ${apiResult.error}`
  };
}

/**
 * CSV parser for GitHub data
 */
export function parseCSV(content: string): any[] {
  const lines = content.trim().split(/\r?\n/);
  const [header, ...rows] = lines;
  const headers = header.split(',').map(h => h.trim());
  
  return rows.map(row => {
    const values = row.split(',');
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = values[i]?.trim() || '';
    });
    return obj;
  });
}

/**
 * JSON parser for GitHub data
 */
export function parseJSON<T = any>(content: string): T {
  return JSON.parse(content);
}

/**
 * Generate GitHub URLs for direct access
 */
export function generateGitHubUrls(
  agentDayFolder: string,
  filename: string,
  config: GitHubConfig = DEFAULT_GITHUB_CONFIG
) {
  return {
    raw: `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${config.basePath}/${agentDayFolder}/${filename}`,
    blob: `https://github.com/${config.owner}/${config.repo}/blob/${config.branch}/${config.basePath}/${agentDayFolder}/${filename}`,
    api: `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.basePath}/${agentDayFolder}/${filename}?ref=${config.branch}`,
    folder: `https://github.com/${config.owner}/${config.repo}/tree/${config.branch}/${config.basePath}/${agentDayFolder}`
  };
}

/**
 * Get all demo data for an agent from GitHub
 */
export async function getAgentDemoDataFromGitHub(
  agentDayFolder: string,
  dataFiles: string[],
  config: GitHubConfig = DEFAULT_GITHUB_CONFIG
): Promise<Record<string, GitHubDataResult<any>>> {
  
  const results: Record<string, GitHubDataResult<any>> = {};
  
  for (const filename of dataFiles) {
    const extension = filename.split('.').pop()?.toLowerCase();
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
    
    results[filename] = await loadAgentDataFromGitHub(
      agentDayFolder,
      filename,
      parser,
      undefined, // No mock data for GitHub access
      config
    );
  }
  
  return results;
}
