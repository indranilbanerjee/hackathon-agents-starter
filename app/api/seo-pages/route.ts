import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "node:fs";

export async function GET(req: NextRequest) {
  // Multiple fallback paths for different environments
  const possiblePaths = [
    "/mnt/data/agents-seed-pack-full/day15_SEO_Sentinel/sitemap.xml",
    "/tmp/agents-seed-pack-full/day15_SEO_Sentinel/sitemap.xml",
    "./data/agents-seed-pack-full/day15_SEO_Sentinel/sitemap.xml",
    "/mnt/data/agents-seed-pack-full/day13_SEO_Issue_Sentinel/sitemap.xml"
  ];

  let xml = "";
  let foundPath = "";

  // Try each path until we find one that exists
  for (const path of possiblePaths) {
    try {
      if (existsSync(path)) {
        xml = readFileSync(path, "utf8");
        foundPath = path;
        break;
      }
    } catch (error) {
      continue;
    }
  }

  // If no file found, use mock data
  if (!xml) {
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2024-01-02</lastmod>
  </url>
  <url>
    <loc>https://example.com/products</loc>
    <lastmod>2024-01-03</lastmod>
  </url>
  <url>
    <loc>https://example.com/services</loc>
    <lastmod>2024-01-04</lastmod>
  </url>
  <url>
    <loc>https://example.com/contact</loc>
    <lastmod>2024-01-05</lastmod>
  </url>
</urlset>`;
    foundPath = "mock-data";
  }

  try {
    const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1]);
    return NextResponse.json({
      count: urls.length,
      urls,
      source: foundPath,
      message: foundPath === "mock-data" ? "Using mock data - no sitemap file found" : "Sitemap parsed successfully"
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to parse sitemap",
      details: error instanceof Error ? error.message : "Unknown error",
      source: foundPath
    }, { status: 500 });
  }
}
